import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './company.model';
import { PaginatedList } from './paginated-list.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = 'https://localhost:44374/api/companies';
  constructor(private http: HttpClient) {}

  getCompanies(page: number, pageSize: number): Observable<PaginatedList<Company>> {
    let params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', pageSize);
    return this.http.get<PaginatedList<Company>>(this.apiUrl, { params });
  }

  createCompany(company: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  updateCompany(id: number, company: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }
}
