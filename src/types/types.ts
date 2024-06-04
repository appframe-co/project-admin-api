import { Application } from "express";

export type RoutesInput = {
  app: Application,
}

export type TErrorResponse = {
  error: string|null;
  description?: string;
  property?: string;
}

export type TProjectModel = {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export type TCounterModel = {
  _id: string;
  seq: number;
}

export type TProjectInput = {
  userId: string;
  name: string;
}

export type TProjectOutput = {
  id: string;
  name: string;
  projectNumber: number
}

type TDoc = {[key: string]: any}

export type TEntry = {
  id: string;
  projectId: string;
  structureId: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  doc: TDoc;
}

export type TSection = {
  id: string;
  projectId: string;
  structureId: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  doc: TDoc;
}

export type TFile = {
  id: string;
  filename: string;
  uuidName: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  contentType: string;
  src: string;
  ext: string;
}
export type TProject = {
  id: string;
  name: string;
  projectNumber: number;
  plan: string;
  planFinishedAt: Date;
  trialFinishedAt: Date;
}
type TFeature = {
  code: string;
  rules: {[key: string]: any};
}

export type TPlan = {
  name: string;
  code: string;
  features: TFeature[];
  default: boolean;
}

export type TAlert = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  structureId: string;
  subjectId: string;
  subjectType: string;
  userId: string;
  projectId: string;
}

export type TValueTranslation = {[key: string]: any}

export type TTranslation = {
  id: string;
	userId: string; 
  projectId: string;
  structureId: string;
  subjectId: string;
  subject: string;
  key: string;
  value: TValueTranslation;
  lang: string;
  createdAt?: string;
}

export type TInputFile = {
  originalSource: string,
  contentType: string
}