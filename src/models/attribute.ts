import {Dimension} from "./dimension";
/**
 * Created by larjo on 16/7/2016.
 */

export class Attribute implements Serializable<Attribute>{
  deserialize(input:Object):Attribute {

    this.ref = input.ref;
    this.datatype = input.datatype;
    this.label = input.label;
    this.orig_attribute = input.orig_attribute;


    return this;
  }
  constructor(){}

  ref:string;
  datatype:string;
  label:string;
  orig_attribute:string;
  dimension:Dimension;


  public get fullLabel():string{
    return (this.dimension?this.dimension.label:"")+"→"+this.label;
  }


}
