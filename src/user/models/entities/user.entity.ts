import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../user.enum';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false, unique: false })
  firstName: string;

  @Column({ type: 'text', nullable: false, unique: false })
  lastName: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false, unique: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: RoleEnum,
    unique: false,
    default: RoleEnum.USER,
  })
  role?: RoleEnum = RoleEnum.USER;

  @Column({ type: 'text', nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
