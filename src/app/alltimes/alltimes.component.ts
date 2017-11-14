import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, DataTable, LazyLoadEvent, Message  } from "primeng/primeng";
import Dexie from 'dexie';
import { Observable } from "rxjs";
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


const MAX_EXAMPLE_RECORDS = 1000;

@Component({
  selector: 'at-alltimes',
  templateUrl: './alltimes.component.html',
  styleUrls: ['./alltimes.component.css']
})
export class AlltimesComponent implements OnInit {

  @ViewChild("dt") dt : DataTable;

  allTimesheetData = [];

  displayEditDialog = false;

  allProjectNames = ['', 'Payroll App', 'Mobile App', 'Agile Times'];

  messages: Message[] = [];

  allProjects = this.allProjectNames.map((proj) => {
    return { label: proj, value: proj }
  });

  selectedRows: Array<any>;

  contextMenu: MenuItem[];

  recordCount : number;
  projectForm : FormGroup;

  constructor(private apollo: Apollo,
              private fb:FormBuilder) { }
  

  ngOnInit() {
    const AllClientsQuery = gql`
       query allTimesheets {
          allTimesheets {
              id
              user
              project
              category
              startTime
              endTime
            }
        }`;
    

    const queryObservable = this.apollo.watchQuery({
      query: AllClientsQuery, pollInterval: 200
      
         }).subscribe(({ data, loading }: any) => {
      
           this.allTimesheetData = data.allTimesheets;
           this.recordCount = data.allTimesheets.length;



          });

    this.projectForm = this.fb.group({
         userName: ['',[Validators.required]],
         projectName: ['',[Validators.required]],
         categoryName: ['',[Validators.required]],
         stTime: ['',[Validators.required]],
         enTime: ['',[Validators.required]]
    })
  }
  onEditComplete(editInfo) { }
  onRowSelect(editInfo){ }
  saveNewTimeEntry() {
    const user = this.projectForm.value.userName;
    const project = this.projectForm.value.projectName;
    const category = this.projectForm.value.categoryName;
    const startTime = this.projectForm.value.stTime;
    const endTime = this.projectForm.value.enTime;
    
   
    const createTimesheet = gql`
    mutation createTimesheet($user: String!, $project: String!, $category: String!, $startTime: Int!, $endTime: Int!, $date: DateTime!) {
      createTimesheet(user: $user, project: $project, category: $category, startTime: $startTime, endTime: $endTime, date: $date ) {
        id
           
        }
      }
    `;

    this.apollo.mutate({
      mutation: createTimesheet,
      variables: {
        user: user,
        project: project,
        category: category,
        startTime: startTime,
        endTime: endTime,
        date: new Date()
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
    this.displayEditDialog = false;
    
  }

  
  cancelTimeDialog(){
    this.displayEditDialog = false;

  }
  }





