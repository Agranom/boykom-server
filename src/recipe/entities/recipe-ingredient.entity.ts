import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, MaxLength } from 'class-validator';
import { Recipe } from './recipe.entity';

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
  @IsString()
  @MaxLength(50)
  @Column({ type: 'varchar', length: 50 })
  amount: number;
}
