import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {CollectionEntity} from "./collectionEntity.model"
import {Event} from "./event.model"
import {MetadataEntity} from "./metadataEntity.model"

@Entity_()
export class NFTEntity {
  constructor(props?: Partial<NFTEntity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  blockNumber!: bigint | undefined | null

  @Column_("bool", {nullable: false})
  burned!: boolean

  @Index_()
  @ManyToOne_(() => CollectionEntity, {nullable: true})
  collection!: CollectionEntity

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("text", {nullable: false})
  currentOwner!: string

  @OneToMany_(() => Event, e => e.nft)
  events!: Event[]

  @Index_()
  @Column_("text", {nullable: false})
  hash!: string

  @Column_("text", {nullable: false})
  issuer!: string

  @Index_()
  @ManyToOne_(() => MetadataEntity, {nullable: true})
  meta!: MetadataEntity | undefined | null

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null

  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  price!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  royalty!: number | undefined | null

  @Column_("text", {nullable: false})
  sn!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  count!: bigint

  @Column_("timestamp with time zone", {nullable: false})
  updatedAt!: Date
}
