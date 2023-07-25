import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Grocery {
  @Prop({type: String, required: true})
  name: string;

  @Prop({type: String, required: true})
  status: string;

  @Prop({type: String, required: true})
  priority: string;
}

export const GrocerySchema = SchemaFactory.createForClass(Grocery);

GrocerySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

