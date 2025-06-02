import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { dataSourceOptions } from "../data-source-configuration";

const seedingDataSourceoOptions: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  factories: ["dist/database/factory/**/*.factory.js"],
  seeds: ["dist/database/seeds/**/*.seeder.js"],
};

const dataSource = new DataSource(seedingDataSourceoOptions);
dataSource.initialize().then(async () => {
  await runSeeders(dataSource);
  process.exit();
});

export default dataSource;
