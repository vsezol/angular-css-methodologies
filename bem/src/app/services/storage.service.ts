import { Injectable } from '@angular/core';
import { Nullable } from '../declarations/types/nullable.type';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get<T>(key: string): Nullable<T> {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? null;
  }
}
