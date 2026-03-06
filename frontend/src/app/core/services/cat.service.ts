import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom, map, Observable } from 'rxjs';

const GET_MY_CATS = gql`
  query GetMyCats {
    myCats {
      id
      name
      breed
      color
      birthDate
      isCastrated
    }
  }
`;

const CREATE_CAT = gql`
  mutation CreateCat($input: CreateCatInput!) {
    createCat(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_CAT = gql`
  mutation UpdateCat($id: Int!, $input: UpdateCatInput!) {
    updateCat(catId: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_CAT = gql`
  mutation DeleteCat($id: Int!) {
    deleteCat(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apollo = inject(Apollo);

  getCats(): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_MY_CATS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result.data?.myCats || [])
    );
  }

  async createCat(input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: CREATE_CAT,
        variables: { input }
      })
    );
    return result.data;
  }

  async updateCat(id: number, input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: UPDATE_CAT,
        variables: { id, input }
      })
    );
    return result.data;
  }

  async deleteCat(id: number): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: DELETE_CAT,
        variables: { id }
      })
    );
    return result.data;
  }
}