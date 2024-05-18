import { ErrorOptions, HttpStatusCode, Severity } from "@mapistry/take-home-challenge-shared";
import { Uuid } from "./Uuid";

export class ValidationError extends Error {}

export class Entity<T> {
  protected readonly _id: Uuid;

  constructor(protected props: T, id?: Uuid) {
    this._id = id || Uuid.create();
  }

  get id(): Uuid {
    return this._id;
  }
}