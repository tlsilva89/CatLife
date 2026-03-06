import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom, map, Observable } from 'rxjs';

const GET_HEALTH_RECORDS = gql`
  query GetHealthRecords($catId: Int!, $type: String) {
    healthRecords(catId: $catId, type: $type) {
      id
      type
      date
      nextDueDate
    }
  }
`;

const ADD_HEALTH_RECORD = gql`
  mutation AddHealthRecord($input: AddHealthRecordInput!) {
    addHealthRecord(input: $input) {
      id
      type
    }
  }
`;

const UPDATE_HEALTH_RECORD = gql`
  mutation UpdateHealthRecord($id: Int!, $input: UpdateHealthRecordInput!) {
    updateHealthRecord(id: $id, input: $input) {
      id
      type
    }
  }
`;

const DELETE_HEALTH_RECORD = gql`
  mutation DeleteHealthRecord($id: Int!) {
    deleteHealthRecord(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class HealthRecordService {
  private apollo = inject(Apollo);

  getRecords(catId: number, type?: string): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_HEALTH_RECORDS,
      variables: { catId, type },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result.data?.healthRecords || [])
    );
  }

  async addRecord(input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: ADD_HEALTH_RECORD,
        variables: { input }
      })
    );
    return result.data;
  }

  async updateRecord(id: number, input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: UPDATE_HEALTH_RECORD,
        variables: { id, input }
      })
    );
    return result.data;
  }

  async deleteRecord(id: number): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: DELETE_HEALTH_RECORD,
        variables: { id }
      })
    );
    return result.data;
  }
}