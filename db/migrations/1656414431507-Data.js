module.exports = class Data1656414431507 {
  name = 'Data1656414431507'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "royalty" integer`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "royalty"`)
  }
}
