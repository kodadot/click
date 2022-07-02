module.exports = class Data1656758315873 {
  name = 'Data1656758315873'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "count" integer NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "count"`)
  }
}
