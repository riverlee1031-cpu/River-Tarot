// Compatibility entry point for the former local-rule checks.
const {spawnSync}=require('node:child_process');
const result=spawnSync(process.execPath,['--test','tests/reading.test.cjs'],{stdio:'inherit'});
process.exit(result.status ?? 1);
