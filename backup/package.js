let obj = {
  name: 'backend',
  version: '1.0.0',
  description: 'E-Commerce Application Backend',
  main: 'server.js',
  type: 'module',
  scripts: {
    start: 'node server.js', // Run in production
    dev: 'nodemon server.js', // Auto-restart in development
    debug: 'node --inspect server.js', // Debug mode
    lint: 'eslint .', // Check code style
    'lint:fix': 'eslint . --fix', // Auto-fix lint errors
    format: 'prettier --write .', // Format code
    test: 'jest --runInBand', // Run unit tests
    'test:watch': 'jest --watch', // Run tests in watch mode
    'test:coverage': 'jest --coverage', // Generate coverage report
    'db:migrate': 'sequelize-cli db:migrate', // Run DB migrations (if Sequelize)
    'db:seed': 'sequelize-cli db:seed:all', // Seed database
    build: 'babel src -d dist', // Compile ES modules to CommonJS (if needed)
    clean: 'rm -rf dist', // Remove build output
    prepare: 'husky install', // Install git hooks
    postinstall: 'npm run build', // Build after install
    deploy: 'npm run build && node dist/server.js', // Build and run for deployment
  },
  keywords: [],
  author: '',
  license: 'ISC',
  dependencies: {
    nodemon: '^3.1.10',
  },
  devDependencies: {
    eslint: '^9.9.0',
    prettier: '^3.2.5',
    jest: '^29.7.0',
    'babel-cli': '^6.26.0',
    'babel-preset-env': '^1.7.0',
    husky: '^9.0.10',
    'sequelize-cli': '^6.6.2',
  },
};
