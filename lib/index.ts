import { 
    path,
    bundler,
    logger
} from "./deps.ts";

function readProjectData() {
    return new Promise<void>((resolve, reject) => {
        Deno.readTextFile(
            path.join(Deno.cwd(), 'project', 'project.c3proj')
        )
        .then(() => resolve())
        .catch(reject);
    });
}

function readDenoJson() {
    type DenoJson = {
        importMap?: `${string}.json`;
        imports?: bundler.ImportMap['imports'];
    }

    return new Promise<bundler.ImportMap>((resolve, reject) => {

        const denoJson = JSON.parse(Deno.readTextFileSync(
            path.join(Deno.cwd(), 'deno.json')
        )) as DenoJson;

        if (denoJson.imports) {
            logger.info('Found "./deno.json" file with ".imports" field');
            resolve({
                imports: denoJson.imports
            });
            return;
        }

        if (denoJson.importMap) {
            Deno.readTextFile(path.join(Deno.cwd(), denoJson.importMap))
                .then((data) => {
                    logger.info(`Found import map "./${denoJson.importMap}" file`);
                    resolve(JSON.parse(data) as bundler.ImportMap);
                })
                .catch(reject)
            ;
            return;
        }

        if (!denoJson.importMap || !denoJson.imports) {
            reject(`".importMap" OR ".imports" property is not assigned in "deno.json"!`);
        }
    })
}

let foundC3ProjectFile: boolean = false;
let bundling = false;
let rebundleTimeout: number;

let startTime: number
let endTime: number;
let count = 0;

export async function bundle(name: `${string}.js`, opts: bundler.BundleOptions, watch?: boolean) {
    try {
        const start = async () => {
            if (count > 0) console.log('\n');
            
            bundling = true;
            startTime = performance.now();
            logger.debug('Starting bundling...');

            if (!foundC3ProjectFile) {
                await readProjectData();
                foundC3ProjectFile = true;
            }

            const importMap = await readDenoJson();

            const result = await bundler.bundle(path.join(Deno.cwd(), 'scripts', name.replace('.js', '.ts')), {
                importMap,
                ...opts
            });

            await Deno.writeTextFile(path.join(Deno.cwd(), 'project', 'scripts', name), result.code);

            if (result.map) {
                await Deno.writeTextFile(path.join(Deno.cwd(), 'project', 'scripts', `${name}.map`), result.map);
            }

            count++;
            endTime = performance.now();
            logger.info(`${((endTime - startTime) / 1000).toFixed(2)}s`, `[${count}] Bundle finished`);
            bundling = false;
        }

        await start();

        if (watch === true) {
            const watcher = Deno.watchFs(path.join(Deno.cwd(), 'scripts'));

            for await (const event of watcher) {
                if (bundling === true) break;

                if (rebundleTimeout) {
                    clearInterval(rebundleTimeout);
                }

                rebundleTimeout = setTimeout(() => start(), 100);
            }
        }
    } catch (e) {
        throw new Error(`Error while building ${e}`, {  });
    }
}