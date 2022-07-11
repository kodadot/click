module.exports = class Data1657544332951 {
  name = 'Data1657544332951'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "count"`)
    await db.query(`ALTER TABLE "nft_entity" ADD "count" numeric NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "count" integer NOT NULL`)
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "count"`)
  }
}
