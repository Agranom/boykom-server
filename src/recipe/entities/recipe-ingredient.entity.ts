import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { Recipe } from './recipe.entity';

export enum eMeasurementUnit {
  Kilogram = 0,
  Gram = 1,
  Liter = 2,
  Millilitre = 3,
  Tablespoon = 4,
  Teaspoon = 5,
  Cup,
  Pound,
}

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Index()
  @Column({ select: false })
  recipeId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Column({ type: 'float', nullable: true })
  quantity?: number;

  @ApiProperty()
  @IsEnum(eMeasurementUnit)
  @IsOptional()
  @Column({ enum: eMeasurementUnit, type: 'enum', nullable: true })
  measurementUnit?: eMeasurementUnit;
}
