import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {MetadataEntity} from "./metadataEntity.model"
import {NFTEntity} from "./nftEntity.model"
import {CollectionType} from "./_collectionType"

@Entity_()
export class CollectionEntity {
  constructor(props?: Partial<CollectionEntity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  blockNumber!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("text", {nullable: false})
  currentOwner!: string

  @Column_("text", {nullable: false})
  issuer!: string

  @Column_("int4", {nullable: false})
  max!: number

  @Index_()
  @ManyToOne_(() => MetadataEntity, {nullable: true})
  meta!: MetadataEntity | undefined | null

  @Column_("bool", {nullable: true})
  burned!: boolean | undefined | null

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @OneToMany_(() => NFTEntity, e => e.collection)
  nfts!: NFTEntity[]

  @Column_("text", {nullable: true})
  symbol!: string | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  updatedAt!: Date

  @Column_("varchar", {length: 7, nullable: false})
  type!: CollectionType
}
