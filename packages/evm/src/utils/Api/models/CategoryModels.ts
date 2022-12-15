import { History } from "./CommonModels"

export interface Category {
  id: number,
  name: string,
  description: string,
  policies: Policies,
  forms: Forms[],
  history: History
}

export interface Policies {
  retentionPolicyId: number,
  uploadPolicyId: number
}

export interface Forms {
  id: number,
  name: string,
  description: string,
  type: string,
  fields: Field[],
  history: History
}

export interface Field {
  id: number,
  name: string,
  type: string,
  dependentField: number,
  display: Display
  history: History
}

export interface Display {
  Caption: string,
  Width: number,
  Order: number
}


export type DropdownModel = {
  id: number,
  value: string,
}

export type CategoryModel = {
  name: string;
  description: string;
  evidenceRetentionPolicy: number;
  uploadPolicy: number;
  categoryForms: DropdownModel[] | any[];
}

export type PoliciesModel = {
  RetentionPolicyId: number;
  UploadPolicyId: number;
}

export type FormModel = {
  Id: number;
  Name : string;
  Type : string;
}

export type RequestCategoryModel = {
  Name: string;
  Description: string;
  Policies: PoliciesModel;
  Forms: FormModel[]
  }