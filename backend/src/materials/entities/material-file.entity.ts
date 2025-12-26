import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Material } from './material.entity';

@Entity()
export class MaterialFile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fileName: string;

    @Column()
    fileType: string;

    @Column('text')
    fileData: string; // Base64 encoded file data

    @ManyToOne(() => Material, (material) => material.files, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
    material: Material;
}
