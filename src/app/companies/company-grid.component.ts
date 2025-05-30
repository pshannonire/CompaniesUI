import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CompanyService } from './company.service';
import { Company } from './company.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-company-grid',
  templateUrl: './company-grid.component.html',
  styleUrls: ['./company-grid.component.css']
})
export class CompanyGridComponent {
  companies: Company[] = [];
  displayedColumns: string[] = ['id', 'name', 'ticker', 'exchange', 'isin', 'website', 'actions'];
  pageSize = 5;
  pageIndex = 0;
  totalCount = 0;
  editingId: number | null = null;
  editCompany: Partial<Company> = {};
  newCompany: Partial<Company> = {};
  dialogRef!: MatDialogRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('createDialog') createDialog!: TemplateRef<any>;

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog
  ) {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies(this.pageIndex + 1, this.pageSize)
      .subscribe(data => {
        this.companies = data.items;
        this.totalCount = data.totalCount;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadCompanies();
  }

  startEdit(company: Company) {
    this.editingId = company.id;
    this.editCompany = { ...company };
  }

  saveEdit(company: Company) {
    if (!this.editCompany.name || !this.editCompany.isin) return;
    this.companyService.updateCompany(company.id, this.editCompany)
      .subscribe(() => {
        this.editingId = null;
        this.loadCompanies();
      });
  }

  cancelEdit() {
    this.editingId = null;
    this.editCompany = {};
  }

  openCreateDialog() {
    this.newCompany = {};
    this.dialogRef = this.dialog.open(this.createDialog);
  }

  createCompany() {
    if (!this.newCompany.name || !this.newCompany.isin) return;
    this.companyService.createCompany(this.newCompany)
      .subscribe(() => {
        this.dialogRef.close();
        this.loadCompanies();
      });
  }
}
