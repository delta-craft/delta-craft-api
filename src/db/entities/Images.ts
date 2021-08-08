import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("images", { schema: "customer_199616_master" })
export class Images {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "updated", nullable: true })
  updated: Date | null;

  @Column("varchar", { name: "requestUrl", nullable: true, length: 50 })
  requestUrl: string | null;

  @Column("varchar", { name: "url", nullable: true, length: 50 })
  url: string | null;

  @Column("varchar", { name: "deletehash", nullable: true, length: 60 })
  deletehash: string | null;

  @Column("varchar", { name: "imgurId", nullable: true, length: 20 })
  imgurId: string | null;
}
