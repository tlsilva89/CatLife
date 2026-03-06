import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom, map, Observable } from 'rxjs';

const GET_EXPENSES = gql`
  query GetExpenses($catId: Int!) {
    expenses(catId: $catId) {
      id
      category
      amount
      date
    }
  }
`;

const ADD_EXPENSE = gql`
  mutation AddExpense($input: AddExpenseInput!) {
    addExpense(input: $input) {
      id
      category
      amount
    }
  }
`;

const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($id: Int!, $input: UpdateExpenseInput!) {
    updateExpense(id: $id, input: $input) {
      id
      category
      amount
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: Int!) {
    deleteExpense(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apollo = inject(Apollo);

  getExpenses(catId: number): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_EXPENSES,
      variables: { catId },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result.data?.expenses || [])
    );
  }

  async addExpense(input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: ADD_EXPENSE,
        variables: { input }
      })
    );
    return result.data;
  }

  async updateExpense(id: number, input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: UPDATE_EXPENSE,
        variables: { id, input }
      })
    );
    return result.data;
  }

  async deleteExpense(id: number): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: DELETE_EXPENSE,
        variables: { id }
      })
    );
    return result.data;
  }
}