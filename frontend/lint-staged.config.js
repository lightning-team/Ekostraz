module.exports = {
  '*.ts': filenames => `npm run lint:fix  -- --files {${filenames.join(',')}}`,
};
