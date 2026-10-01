#!/usr/bin/env node

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const RELEASE_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const DEPENDENCY_SECTIONS = ['dependencies', 'optionalDependencies', 'peerDependencies'];

function fail(message) {
    throw new Error(message);
}

function parseArguments(argv) {
    const options = {};

    for (let index = 0; index < argv.length; index += 2) {
        const name = argv[index];
        const value = argv[index + 1];

        if (!name?.startsWith('--') || value === undefined) {
            fail(`Expected --name value arguments, received: ${argv.join(' ')}`);
        }

        options[name.slice(2)] = value;
    }

    return options;
}

function releaseVersionFor({ mode, version, runId }) {
    if (!RELEASE_VERSION_PATTERN.test(version)) {
        fail(`Expected a release version in X.Y.Z format, received: ${version}`);
    }

    if (mode === 'stable') {
        return version;
    }

    if (mode === 'canary') {
        if (!/^\d+$/.test(runId)) {
            fail(`Expected a numeric GitHub run ID, received: ${runId}`);
        }

        return `${version}-canary.${runId}`;
    }

    fail(`Unsupported release mode: ${mode}`);
}

async function publicPackages() {
    const packagesDirectory = join(process.cwd(), 'packages');
    const entries = await readdir(packagesDirectory, { withFileTypes: true });
    const result = [];

    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
        if (!entry.isDirectory()) {
            continue;
        }

        const directory = join('packages', entry.name);
        const manifestPath = join(process.cwd(), directory, 'package.json');

        try {
            const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

            if (manifest.private !== true) {
                result.push({ directory, manifestPath, manifest });
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                continue;
            }

            throw error;
        }
    }

    if (result.length === 0) {
        fail('No public packages were found in packages/*.');
    }

    return result;
}

function updateInternalDependencies(manifest, packageVersions, mode) {
    const rangePrefix = mode === 'stable' ? '^' : '';

    for (const section of DEPENDENCY_SECTIONS) {
        if (!manifest[section]) {
            continue;
        }

        for (const dependencyName of Object.keys(manifest[section])) {
            const version = packageVersions.get(dependencyName);

            if (version) {
                manifest[section][dependencyName] = `${rangePrefix}${version}`;
            }
        }
    }
}

function updateRepository(manifest, repository, directory) {
    manifest.repository = {
        type: 'git',
        url: repository,
        directory,
    };
}

async function main() {
    const {
        mode,
        version: stableVersion,
        'run-id': runId,
        output,
        repository,
    } = parseArguments(process.argv.slice(2));

    if (!mode || !output || !repository) {
        fail('--mode, --output, and --repository are required.');
    }

    if (mode === 'stable' && !stableVersion) {
        fail('--version is required for stable releases.');
    }

    if (mode === 'canary' && !runId) {
        fail('--run-id is required for canary releases.');
    }

    const packages = await publicPackages();
    const packageVersions = new Map();

    for (const { manifest } of packages) {
        if (typeof manifest.name !== 'string' || manifest.name.length === 0) {
            fail('Every public package must have a non-empty name.');
        }

        if (packageVersions.has(manifest.name)) {
            fail(`Duplicate public package name: ${manifest.name}`);
        }

        const version = mode === 'stable' ? stableVersion : manifest.version;
        packageVersions.set(manifest.name, releaseVersionFor({ mode, version, runId }));
    }

    for (const packageInfo of packages) {
        const { manifest, manifestPath } = packageInfo;
        manifest.version = packageVersions.get(manifest.name);
        updateInternalDependencies(manifest, packageVersions, mode);
        updateRepository(manifest, repository, packageInfo.directory);
        await writeFile(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
    }

    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, `${packages.map(({ directory }) => directory).join('\n')}\n`);
    console.error(`Prepared ${packages.length} public package(s) for ${mode} publication.`);
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
