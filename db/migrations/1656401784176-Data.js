module.exports = class Data1656401784176 {
  name = 'Data1656401784176'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "price" numeric`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "price"`)
  }
}
