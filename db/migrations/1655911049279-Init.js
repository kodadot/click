module.exports = class Init1655911049279 {
  name = 'Init1655911049279'

  async up(db) {
    await db.query(`CREATE TABLE "metadata_entity" ("id" character varying NOT NULL, "name" text, "description" text, "image" text, "attributes" jsonb, "animation_url" text, "type" text, CONSTRAINT "PK_2cb9d5d4ae99d9a27497bf8d2e8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "event" ("id" character varying NOT NULL, "block_number" numeric, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "caller" text NOT NULL, "current_owner" text NOT NULL, "interaction" character varying(7) NOT NULL, "meta" text NOT NULL, "nft_id" character varying NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_9380d479563e5a664759359470" ON "event" ("nft_id") `)
    await db.query(`CREATE TABLE "nft_entity" ("id" character varying NOT NULL, "block_number" numeric, "burned" boolean NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "current_owner" text NOT NULL, "hash" text NOT NULL, "issuer" text NOT NULL, "metadata" text, "name" text, "sn" text NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "collection_id" character varying NOT NULL, "meta_id" character varying, CONSTRAINT "PK_ed09c6a38c0f0a867d5a7b63f0d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_4b98bf4d630de0037475b9bbb7" ON "nft_entity" ("collection_id") `)
    await db.query(`CREATE INDEX "IDX_16e57ac8478b6ea1f383e3eb03" ON "nft_entity" ("hash") `)
    await db.query(`CREATE INDEX "IDX_2bfc45b91959a14ab8b2d734cd" ON "nft_entity" ("meta_id") `)
    await db.query(`CREATE TABLE "collection_entity" ("id" character varying NOT NULL, "block_number" numeric, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "current_owner" text NOT NULL, "issuer" text NOT NULL, "max" numeric NOT NULL, "burned" boolean, "metadata" text, "name" text, "symbol" text, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "meta_id" character varying, CONSTRAINT "PK_5d44e140c4fcb3d961f9e83405f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_014542183f297493eab0cd8bdf" ON "collection_entity" ("meta_id") `)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_9380d479563e5a664759359470a" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a" FOREIGN KEY ("collection_id") REFERENCES "collection_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_2bfc45b91959a14ab8b2d734cd2" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "collection_entity" ADD CONSTRAINT "FK_014542183f297493eab0cd8bdf8" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "metadata_entity"`)
    await db.query(`DROP TABLE "event"`)
    await db.query(`DROP INDEX "public"."IDX_9380d479563e5a664759359470"`)
    await db.query(`DROP TABLE "nft_entity"`)
    await db.query(`DROP INDEX "public"."IDX_4b98bf4d630de0037475b9bbb7"`)
    await db.query(`DROP INDEX "public"."IDX_16e57ac8478b6ea1f383e3eb03"`)
    await db.query(`DROP INDEX "public"."IDX_2bfc45b91959a14ab8b2d734cd"`)
    await db.query(`DROP TABLE "collection_entity"`)
    await db.query(`DROP INDEX "public"."IDX_014542183f297493eab0cd8bdf"`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_9380d479563e5a664759359470a"`)
    await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a"`)
    await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_2bfc45b91959a14ab8b2d734cd2"`)
    await db.query(`ALTER TABLE "collection_entity" DROP CONSTRAINT "FK_014542183f297493eab0cd8bdf8"`)
  }
}
