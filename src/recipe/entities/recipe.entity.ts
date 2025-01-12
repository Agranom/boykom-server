import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import {
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Type } from 'class-transformer';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Index()
  @Column({ select: false })
  authorId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  @Column({ type: 'varchar', length: 200 })
  description: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  @Column({ type: 'varchar', length: 2000 })
  cookingMethod: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Column({ type: 'integer', nullable: true })
  portionsCount?: number;

  @ApiProperty({ isArray: true, type: RecipeIngredient })
  @ArrayNotEmpty()
  @Type(() => RecipeIngredient)
  @ValidateNested({ each: true })
  @OneToMany(() => RecipeIngredient, (ing) => ing.recipe)
  ingredients: RecipeIngredient[];
}
