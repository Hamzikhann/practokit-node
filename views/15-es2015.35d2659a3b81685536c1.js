(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{JBYO:function(c,e,a){"use strict";a.r(e),a.d(e,"AssignmentModule",(function(){return ac}));var t=a("ofXK"),i=a("3Pt+"),s=a("tyNb"),n=a("wd/R"),o=a("fXoL"),d=a("5eHb"),l=a("sGSV"),r=a("Bdnu"),b=a("CfA1"),u=a("EdIQ"),p=a("1kSV"),g=a("CzEO"),m=a("kvL/"),h=a("oOf3");function v(c,e){1&c&&(o.bc(0,"div",49),o.bc(1,"a",50),o.Oc(2,"Create New Task"),o.ac(),o.ac())}function f(c,e){if(1&c){const c=o.cc();o.bc(0,"div",51),o.bc(1,"div",18),o.bc(2,"div",52),o.bc(3,"h5",53),o.Oc(4," Filters "),o.ac(),o.bc(5,"div",54),o.bc(6,"div",55),o.bc(7,"ul",56),o.bc(8,"li"),o.bc(9,"a",57),o.mc("click",(function(){return o.Ec(c),o.pc().ApplyFilte("all")})),o.Xb(10,"i",58),o.Oc(11,"All"),o.ac(),o.ac(),o.bc(12,"li"),o.bc(13,"a",57),o.mc("click",(function(){return o.Ec(c),o.pc().ApplyFilte("inQueue")})),o.Xb(14,"i",59),o.Oc(15,"In Queue"),o.ac(),o.ac(),o.bc(16,"li"),o.bc(17,"a",57),o.mc("click",(function(){return o.Ec(c),o.pc().ApplyFilte("submitted")})),o.Xb(18,"i",60),o.Oc(19,"Submitted"),o.ac(),o.ac(),o.bc(20,"li"),o.bc(21,"a",57),o.mc("click",(function(){return o.Ec(c),o.pc().ApplyFilte("graded")})),o.Xb(22,"i",61),o.Oc(23,"Graded"),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac()}if(2&c){const c=o.pc();o.Ib(8),o.Nb("active","all"==c.filterType),o.Ib(4),o.Nb("active","inQueue"==c.filterType),o.Ib(4),o.Nb("active","submitted"==c.filterType),o.Ib(4),o.Nb("active","graded"==c.filterType)}}const k=function(c){return["/todo",c]};function I(c,e){if(1&c&&(o.bc(0,"tr"),o.bc(1,"td"),o.bc(2,"a",5),o.Xb(3,"i",67),o.bc(4,"strong"),o.Oc(5),o.ac(),o.Xb(6,"br"),o.ac(),o.ac(),o.bc(7,"td"),o.Oc(8),o.ac(),o.bc(9,"td"),o.Oc(10),o.ac(),o.ac()),2&c){const c=e.$implicit;o.Ib(2),o.vc("routerLink",o.zc(4,k,c.id)),o.Ib(3),o.Pc(c.title),o.Ib(3),o.Qc(" ",c.class.course.name," "),o.Ib(2),o.Qc(" ",c.dueDate," ")}}const O=function(c){return{itemsPerPage:10,currentPage:c}};function M(c,e){if(1&c&&(o.bc(0,"div",62),o.bc(1,"table",63),o.bc(2,"thead"),o.bc(3,"tr"),o.bc(4,"th",64),o.Oc(5,"Task Name"),o.ac(),o.bc(6,"th",65),o.Oc(7,"Course"),o.ac(),o.bc(8,"th",65),o.Oc(9,"Due Date"),o.ac(),o.ac(),o.ac(),o.bc(10,"tbody"),o.Mc(11,I,11,6,"tr",66),o.qc(12,"paginate"),o.ac(),o.ac(),o.ac()),2&c){const c=o.pc();o.Ib(11),o.vc("ngForOf",o.sc(12,1,c.filteredTasks,o.zc(4,O,c.p)))}}function y(c,e){if(1&c){const c=o.cc();o.bc(0,"pagination-controls",68),o.mc("pageChange",(function(e){return o.Ec(c),o.pc().p=e})),o.ac()}}function T(c,e){1&c&&(o.bc(0,"div",69),o.Xb(1,"img",70),o.bc(2,"p"),o.Oc(3,"No Assignments found"),o.ac(),o.ac())}function D(c,e){1&c&&(o.bc(0,"div",69),o.Xb(1,"img",71),o.ac())}function S(c,e){if(1&c&&(o.bc(0,"option",72),o.Oc(1),o.ac()),2&c){const c=e.$implicit;o.wc("value",c.id),o.Ib(1),o.Qc("",c.name," ")}}function C(c,e){if(1&c&&(o.bc(0,"option",72),o.Oc(1),o.ac()),2&c){const c=e.$implicit;o.wc("value",c.id),o.Ib(1),o.Qc(" ",c.title," ")}}function w(c,e){if(1&c){const c=o.cc();o.bc(0,"ngx-dropzone-preview",73),o.mc("removed",(function(){o.Ec(c);const a=e.$implicit;return o.pc().onRemove(a)})),o.bc(1,"ngx-dropzone-label"),o.Oc(2),o.ac(),o.ac()}if(2&c){const c=e.$implicit;o.vc("removable",!0),o.Ib(2),o.Rc("",c.name," (",c.type,")")}}const x=function(){return["/"]},F=function(c){return{"col-lg-12":c}};let A=(()=>{class c{constructor(c,e,a,t,i,s){this.toastr=c,this.taskService=e,this.courseService=a,this.classService=t,this.config=i,this.calendar=s,this.loading=!0,this.p=1,this.uploadFileSize=this.config.uploadFileSize,this.search="",this.tasks=[],this.filteredTasks=[],this.filterType="all",this.courses=[],this.sessions=[],this.task={title:"",description:"",dueDate:this.calendar.getToday(),courseId:"",classId:"",files:[]}}ngOnInit(){this.user=JSON.parse(localStorage.getItem("user")),this.getTasks(),this.getCourses()}getTasks(){this.taskService.getTasks().subscribe(c=>{this.tasks=c.body,this.tasks.forEach(c=>{c.dueDate=n(c.dueDate).format("MMMM DD, YY"),c.submissionStatus=c.submissions.length?c.submissions[0].status:"inQueue"}),this.filteredTasks=this.tasks,this.loading=!1})}getCourses(){this.courseService.getCourses().subscribe(c=>{this.courses=c.body})}getSessions(){this.classService.getClasses(this.task.courseId).subscribe(c=>{this.sessions=c.body,this.sessions.forEach(c=>{var e=c.timing.split(" - ")[0],a=c.timing.split(" - ")[1];c.startTime=e.split(":")[0]>12?e.split(":")[0]-12+":"+e.split(":")[1]+" PM":e+" AM",c.endTime=a.split(":")[0]>12?a.split(":")[0]-12+":"+a.split(":")[1]+" PM":a+" AM",c.title=c.title+" ( "+c.startTime+" - "+c.endTime+" )"})})}onSelect(c){c.addedFiles.forEach(c=>{this.task.files.length<5&&(c.size>this.uploadFileSize?this.toastr.error("Please adhere to the file size guidelines"):this.task.files.push(c))})}onRemove(c){this.task.files.splice(this.task.files.indexOf(c),1)}AddTask(){var c=new FormData;c.append("title",this.task.title),c.append("description",this.task.description),c.append("dueDate",this.task.dueDate.month+"/"+this.task.dueDate.day+"/"+this.task.dueDate.year),c.append("classId",this.task.classId),this.task.files.forEach(e=>{c.append("files",e)}),this.taskService.addTask(c).subscribe(c=>{this.task={title:"",description:"",dueDate:this.calendar.getToday(),courseId:"",classId:"",files:[]},this.toastr.success("Task Created."),this.getTasks()})}Search(){if("all"==this.filterType&&(this.filteredTasks=[]),this.search)if("all"!=this.filterType){var c=[];this.filteredTasks.forEach(e=>{e.title.includes(this.search)&&c.push(e)}),this.filteredTasks=c}else this.tasks.forEach(c=>{c.title.includes(this.search)&&this.filteredTasks.push(c)});else this.filterType="all",this.filteredTasks=this.tasks}ApplyFilte(c){this.filterType=c,this.search||(this.filteredTasks=[]),"all"==this.filterType?this.filteredTasks=this.tasks:this.search?this.filteredTasks.forEach(c=>{c.submissionStatus==this.filterType&&this.filteredTasks.push(c)}):this.tasks.forEach(c=>{c.submissionStatus==this.filterType&&this.filteredTasks.push(c)})}}return c.\u0275fac=function(e){return new(e||c)(o.Wb(d.b),o.Wb(l.a),o.Wb(r.a),o.Wb(b.a),o.Wb(u.a),o.Wb(p.a))},c.\u0275cmp=o.Qb({type:c,selectors:[["app-todo"]],decls:102,vars:21,consts:[[1,"page-content"],[1,"page-info"],["aria-label","breadcrumb"],[1,"breadcrumb"],[1,"breadcrumb-item"],[3,"routerLink"],["aria-current","page",1,"breadcrumb-item","active"],[1,"row","d-flex"],[1,"col-md-12","p-0"],[1,"page-options","d-flex","mb-3"],[1,"navbar-search"],[1,"form-group"],["type","text","name","search","placeholder","Search...","id","nav-search",3,"ngModel","ngModelChange"],["class","ml-4",4,"ngIf"],[1,"main-wrapper",2,"padding-top","unset"],[1,"row"],["class","col-lg-3",4,"ngIf"],[1,"col-lg-9",3,"ngClass"],[1,"card"],["class","card-body p-0",4,"ngIf"],["class","inbox-pagination",3,"pageChange",4,"ngIf"],["class","placeholder",4,"ngIf"],["id","newTask","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["role","document",1,"modal-dialog","modal-lg","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","data-dismiss","modal","aria-label","Close",1,"close"],[1,"material-icons"],[1,"modal-body"],[1,"col-12"],[1,"text-danger"],["type","text","id","new-task-name","placeholder","Abc..",1,"form-control",3,"ngModel","ngModelChange"],[1,"col"],[1,"input-group"],["placeholder","yyyy-mm-dd","name","dp","readonly","","ngbDatepicker","",1,"form-control",3,"ngModel","ngModelChange"],["d","ngbDatepicker"],[1,"input-group-append"],["type","button",1,"btn","btn-outline-secondary","calendar","d-flex","align-items-center",3,"click"],[1,"material-icons-outlined"],[1,"form-control",3,"ngModel","ngModelChange"],["selected","","disabled",""],[3,"value",4,"ngFor","ngForOf"],["name","description","placeholder","Enter project description",1,"quill-textbox",3,"ngModel","ngModelChange"],[2,"height","unset","border","2px dashed #e8e8e8",3,"change"],[3,"removable","removed",4,"ngFor","ngForOf"],[1,"modal-footer"],["type","button","data-dismiss","modal",1,"btn","btn-secondary"],["type","button","data-dismiss","modal",1,"btn","btn-primary",3,"disabled","click"],[1,"ml-4"],["href","javascript:void(0)","data-toggle","modal","data-target","#newTask",1,"btn","btn-primary"],[1,"col-lg-3"],[1,"card-body"],[1,"card-title",2,"margin-bottom","unset !important"],[1,"todo-sidebar"],[1,"todo-menu",2,"margin","unset"],[1,"list-unstyled"],["href","javascript:void(0)",3,"click"],[1,"fas","fa-bars"],[1,"far","fa-eye"],[1,"far","fa-copy"],[1,"fas","fa-edit"],[1,"card-body","p-0"],[1,"table","table-striped","table-courses"],["scope","col",1,"w-50"],["scope","col"],[4,"ngFor","ngForOf"],[1,"far","fa-file","pr-2"],[1,"inbox-pagination",3,"pageChange"],[1,"placeholder"],["src","assets/images/no-data.png","alt",""],["src","assets/images/loader.gif","alt",""],[3,"value"],[3,"removable","removed"]],template:function(c,e){if(1&c){const c=o.cc();o.bc(0,"div",0),o.bc(1,"div",1),o.bc(2,"nav",2),o.bc(3,"ol",3),o.bc(4,"li",4),o.bc(5,"a",5),o.Oc(6,"Dashboard"),o.ac(),o.ac(),o.bc(7,"li",6),o.Oc(8,"Assignments"),o.ac(),o.ac(),o.ac(),o.bc(9,"div",7),o.bc(10,"div",8),o.bc(11,"div",9),o.bc(12,"div",10),o.bc(13,"form"),o.bc(14,"div",11),o.bc(15,"input",12),o.mc("ngModelChange",(function(c){return e.search=c}))("ngModelChange",(function(){return e.Search()})),o.ac(),o.ac(),o.ac(),o.ac(),o.Mc(16,v,3,0,"div",13),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(17,"div",14),o.bc(18,"div",15),o.Mc(19,f,24,8,"div",16),o.bc(20,"div",17),o.bc(21,"div",18),o.Mc(22,M,13,6,"div",19),o.ac(),o.Mc(23,y,1,0,"pagination-controls",20),o.Mc(24,T,4,0,"div",21),o.Mc(25,D,2,0,"div",21),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(26,"div",22),o.bc(27,"div",23),o.bc(28,"div",24),o.bc(29,"div",25),o.bc(30,"h5",26),o.Oc(31,"New Task"),o.ac(),o.bc(32,"button",27),o.bc(33,"i",28),o.Oc(34,"close"),o.ac(),o.ac(),o.ac(),o.bc(35,"div",29),o.bc(36,"div",15),o.bc(37,"div",30),o.bc(38,"div",11),o.bc(39,"label"),o.Oc(40,"Title"),o.ac(),o.bc(41,"span",31),o.Oc(42," *"),o.ac(),o.bc(43,"input",32),o.mc("ngModelChange",(function(c){return e.task.title=c})),o.ac(),o.ac(),o.bc(44,"div",15),o.bc(45,"div",33),o.bc(46,"div",11),o.bc(47,"label"),o.Oc(48,"Due Date"),o.ac(),o.bc(49,"span",31),o.Oc(50," *"),o.ac(),o.bc(51,"div",34),o.bc(52,"input",35,36),o.mc("ngModelChange",(function(c){return e.task.dueDate=c})),o.ac(),o.bc(54,"div",37),o.bc(55,"button",38),o.mc("click",(function(){return o.Ec(c),o.Dc(53).toggle()})),o.bc(56,"i",39),o.Oc(57,"calendar_today"),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(58,"div",33),o.bc(59,"div",11),o.bc(60,"label"),o.Oc(61,"Course"),o.ac(),o.bc(62,"span",31),o.Oc(63," *"),o.ac(),o.bc(64,"select",40),o.mc("ngModelChange",(function(c){return e.task.courseId=c}))("ngModelChange",(function(){return e.getSessions()})),o.bc(65,"option",41),o.Oc(66,"Select"),o.ac(),o.Mc(67,S,2,2,"option",42),o.ac(),o.ac(),o.ac(),o.bc(68,"div",33),o.bc(69,"div",11),o.bc(70,"label"),o.Oc(71,"Session"),o.ac(),o.bc(72,"span",31),o.Oc(73," *"),o.ac(),o.bc(74,"select",40),o.mc("ngModelChange",(function(c){return e.task.classId=c})),o.bc(75,"option",41),o.Oc(76,"Select"),o.ac(),o.Mc(77,C,2,2,"option",42),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(78,"div",30),o.bc(79,"div",11),o.bc(80,"label"),o.Oc(81,"Description"),o.ac(),o.bc(82,"span",31),o.Oc(83," *"),o.ac(),o.bc(84,"quill-editor",43),o.mc("ngModelChange",(function(c){return e.task.description=c})),o.ac(),o.ac(),o.ac(),o.bc(85,"div",30),o.bc(86,"div",11),o.bc(87,"label"),o.Oc(88,"Attachments"),o.ac(),o.bc(89,"ngx-dropzone",44),o.mc("change",(function(c){return e.onSelect(c)})),o.bc(90,"ngx-dropzone-label"),o.Oc(91,"Drop Attachments here!"),o.ac(),o.Mc(92,w,3,3,"ngx-dropzone-preview",45),o.ac(),o.bc(93,"span",31),o.Oc(94," * "),o.ac(),o.bc(95,"span"),o.Oc(96,"File size cannot be greater then 5 MB."),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(97,"div",46),o.bc(98,"button",47),o.Oc(99,"Cancel"),o.ac(),o.bc(100,"button",48),o.mc("click",(function(){return e.AddTask()})),o.Oc(101," Save"),o.ac(),o.ac(),o.ac(),o.ac(),o.ac()}2&c&&(o.Ib(5),o.vc("routerLink",o.yc(18,x)),o.Ib(10),o.vc("ngModel",e.search),o.Ib(1),o.vc("ngIf","Teacher"==e.user.role.title),o.Ib(3),o.vc("ngIf","Student"==e.user.role.title),o.Ib(1),o.vc("ngClass",o.zc(19,F,"Student"!=e.user.role.title)),o.Ib(2),o.vc("ngIf",e.filteredTasks.length),o.Ib(1),o.vc("ngIf",e.filteredTasks.length>10),o.Ib(1),o.vc("ngIf",!e.filteredTasks.length&&!e.loading),o.Ib(1),o.vc("ngIf",e.loading),o.Ib(18),o.vc("ngModel",e.task.title),o.Ib(9),o.vc("ngModel",e.task.dueDate),o.Ib(12),o.vc("ngModel",e.task.courseId),o.Ib(3),o.vc("ngForOf",e.courses),o.Ib(7),o.vc("ngModel",e.task.classId),o.Ib(3),o.vc("ngForOf",e.sessions),o.Ib(7),o.vc("ngModel",e.task.description),o.Ib(8),o.vc("ngForOf",e.task.files),o.Ib(8),o.vc("disabled",!(e.task.title&&e.task.dueDate&&e.task.classId&&e.task.description)))},directives:[s.d,i.t,i.j,i.k,i.b,i.i,i.l,t.n,t.l,p.e,i.q,i.m,i.s,t.m,g.a,m.a,m.d,h.c,m.c],pipes:[h.b],styles:[""]}),c})();var E=a("iWkd"),z=a("tk/3");let N=(()=>{class c{constructor(c,e){this.http=c,this.config=e,this.baseUrl=this.config.reqBaseUrl+"submissions/"}getSubmission(c){return this.http.get(this.baseUrl+"task/"+c,{observe:"response"})}addSubmission(c,e,a){return this.http.post(this.baseUrl+"user/"+c+"/task/"+e,a,{observe:"response"})}gradeTask(c,e){return this.http.put(this.baseUrl+c,e,{observe:"response"})}}return c.\u0275fac=function(e){return new(e||c)(o.jc(z.b),o.jc(u.a))},c.\u0275prov=o.Sb({token:c,factory:c.\u0275fac,providedIn:"root"}),c})();function j(c,e){1&c&&(o.bc(0,"a",62),o.Oc(1,"Mark as Complete"),o.ac())}function G(c,e){1&c&&(o.bc(0,"a",63),o.Oc(1,"Delete Task"),o.ac())}function Y(c,e){1&c&&(o.bc(0,"a",64),o.Oc(1,"Edit Task"),o.ac())}function U(c,e){1&c&&(o.bc(0,"a",65),o.Oc(1,"Upload Files"),o.ac())}function L(c,e){if(1&c){const c=o.cc();o.bc(0,"div",67),o.bc(1,"div",68),o.bc(2,"div",69),o.bc(3,"a",70),o.bc(4,"i",8),o.Oc(5,"more_vert"),o.ac(),o.ac(),o.bc(6,"div",71),o.bc(7,"a",72),o.Oc(8,"Download"),o.ac(),o.bc(9,"a",73),o.mc("click",(function(){o.Ec(c);const a=e.$implicit;return o.pc(3).attachmentDelete(a.id)})),o.Oc(10,"Delete"),o.ac(),o.ac(),o.ac(),o.bc(11,"div",74),o.bc(12,"i",8),o.Oc(13,"description"),o.ac(),o.ac(),o.bc(14,"div",75),o.bc(15,"p"),o.Oc(16),o.ac(),o.ac(),o.ac(),o.ac()}if(2&c){const c=e.$implicit,a=o.pc(3);o.Ib(7),o.wc("href",a.imgUrl+c.path,o.Gc),o.Ib(9),o.Pc(c.originalname)}}function P(c,e){if(1&c&&(o.bc(0,"div",34),o.Mc(1,L,17,2,"div",66),o.ac()),2&c){const c=o.pc(2);o.Ib(1),o.vc("ngForOf",c.attachments)}}function R(c,e){1&c&&(o.bc(0,"div",76),o.Xb(1,"img",77),o.bc(2,"p"),o.Oc(3,"No Files found"),o.ac(),o.ac())}function W(c,e){1&c&&(o.bc(0,"th",57),o.Oc(1,"Action"),o.ac())}function B(c,e){if(1&c&&(o.bc(0,"td"),o.bc(1,"a",80),o.bc(2,"i",8),o.Oc(3,"description"),o.ac(),o.ac(),o.ac()),2&c){const c=o.pc().$implicit;o.Ib(1),o.wc("href",c.user.submissions[0].link,o.Gc)}}function Q(c,e){1&c&&(o.bc(0,"td"),o.Oc(1," N/A "),o.ac())}function X(c,e){if(1&c){const c=o.cc();o.bc(0,"td",51),o.bc(1,"a",81),o.mc("click",(function(){o.Ec(c);const e=o.pc().$implicit;return o.pc(2).onGradeModal(e)})),o.bc(2,"span",82),o.Oc(3,"Grade"),o.ac(),o.ac(),o.ac()}}function $(c,e){if(1&c&&(o.bc(0,"tr"),o.bc(1,"td"),o.Oc(2),o.ac(),o.bc(3,"td"),o.Oc(4),o.ac(),o.bc(5,"td"),o.Oc(6),o.ac(),o.Mc(7,B,4,1,"td",78),o.Mc(8,Q,2,0,"td",78),o.Mc(9,X,4,0,"td",79),o.ac()),2&c){const c=e.$implicit,a=o.pc(2);o.Ib(2),o.Qc("",c.user.firstName+" "+c.user.lastName," "),o.Ib(2),o.Qc(" ",c.user.submissions[0]?c.user.submissions[0].createdAt:"Not Submitted"," "),o.Ib(2),o.Qc("",c.user.submissions[0]&&c.user.submissions[0].grade||"Not Graded"," "),o.Ib(1),o.vc("ngIf",c.user.submissions[0]&&c.user.submissions[0].link),o.Ib(1),o.vc("ngIf",!c.user.submissions[0]||!c.user.submissions[0].link),o.Ib(1),o.vc("ngIf","Teacher"==a.user.role.title)}}const q=function(){return["/"]};function J(c,e){if(1&c&&(o.bc(0,"div",22),o.bc(1,"div",23),o.bc(2,"nav",24),o.bc(3,"ol",25),o.bc(4,"li",26),o.bc(5,"a",27),o.Oc(6,"Dashboard"),o.ac(),o.ac(),o.bc(7,"li",28),o.Oc(8,"Assignments"),o.ac(),o.ac(),o.ac(),o.bc(9,"div",29),o.Mc(10,j,2,0,"a",30),o.Mc(11,G,2,0,"a",31),o.Mc(12,Y,2,0,"a",32),o.ac(),o.ac(),o.bc(13,"div",33),o.bc(14,"div",34),o.bc(15,"div",35),o.bc(16,"div",36),o.bc(17,"div",37),o.bc(18,"div",34),o.bc(19,"div",38),o.bc(20,"h5",39),o.Oc(21),o.ac(),o.Xb(22,"p",40),o.ac(),o.ac(),o.bc(23,"div",34),o.bc(24,"div",41),o.bc(25,"h5",42),o.Oc(26,"Assigned By: "),o.ac(),o.ac(),o.bc(27,"div",43),o.Oc(28),o.ac(),o.ac(),o.bc(29,"div",34),o.bc(30,"div",41),o.bc(31,"h5",42),o.Oc(32,"Created At: "),o.ac(),o.ac(),o.bc(33,"div",43),o.Oc(34),o.ac(),o.ac(),o.bc(35,"div",34),o.bc(36,"div",38),o.Xb(37,"hr"),o.ac(),o.bc(38,"div",41),o.bc(39,"h5",42),o.Oc(40,"Due Date: "),o.ac(),o.ac(),o.bc(41,"div",43),o.Oc(42),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(43,"div",44),o.bc(44,"div",45),o.bc(45,"div",34),o.bc(46,"div",46),o.bc(47,"h5",47),o.Oc(48,"FILES SHARED WITH YOU"),o.ac(),o.ac(),o.bc(49,"div",48),o.Mc(50,U,2,0,"a",49),o.ac(),o.ac(),o.Mc(51,P,2,1,"div",50),o.bc(52,"div",51),o.Mc(53,R,4,0,"div",52),o.ac(),o.ac(),o.ac(),o.bc(54,"div",44),o.bc(55,"div",45),o.bc(56,"div",34),o.bc(57,"div",38),o.bc(58,"h5",47),o.Oc(59,"ASSIGNMENT SUBMISSIONS"),o.ac(),o.ac(),o.ac(),o.bc(60,"div",34),o.bc(61,"div",35),o.bc(62,"div",53),o.bc(63,"div",54),o.bc(64,"div",55),o.bc(65,"table",56),o.bc(66,"thead"),o.bc(67,"tr"),o.bc(68,"th",57),o.Oc(69,"Student Name"),o.ac(),o.bc(70,"th",58),o.Oc(71,"Submission Date"),o.ac(),o.bc(72,"th",59),o.Oc(73,"Grade"),o.ac(),o.bc(74,"th",57),o.Oc(75,"Download"),o.ac(),o.Mc(76,W,2,0,"th",60),o.ac(),o.ac(),o.bc(77,"tbody"),o.Mc(78,$,10,6,"tr",61),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac()),2&c){const c=o.pc();o.Ib(5),o.vc("routerLink",o.yc(14,q)),o.Ib(5),o.vc("ngIf","Student"==c.user.role.title&&!c.enrollments[0].user.submissions[0]),o.Ib(1),o.vc("ngIf","Teacher"==c.user.role.title),o.Ib(1),o.vc("ngIf","Teacher"==c.user.role.title),o.Ib(9),o.Pc(c.task.title),o.Ib(1),o.vc("innerHTML",c.task.description,o.Fc),o.Ib(6),o.Pc(c.task.user.firstName+" "+c.task.user.lastName),o.Ib(6),o.Pc(c.task.createdAt),o.Ib(8),o.Pc(c.task.dueDateFormatted),o.Ib(8),o.vc("ngIf","Teacher"==c.user.role.title),o.Ib(1),o.vc("ngIf",c.attachments.length),o.Ib(2),o.vc("ngIf",!c.attachments.length),o.Ib(23),o.vc("ngIf","Teacher"==c.user.role.title),o.Ib(2),o.vc("ngForOf",c.enrollments)}}function H(c,e){1&c&&(o.bc(0,"div",83),o.Xb(1,"img",84),o.ac())}function _(c,e){if(1&c){const c=o.cc();o.bc(0,"div",4),o.bc(1,"div",5),o.bc(2,"h5",6),o.Oc(3,"Edit Task"),o.ac(),o.bc(4,"button",7),o.bc(5,"i",8),o.Oc(6,"close"),o.ac(),o.ac(),o.ac(),o.bc(7,"div",9),o.bc(8,"div",10),o.bc(9,"label"),o.Oc(10,"Title"),o.ac(),o.bc(11,"input",85),o.mc("ngModelChange",(function(e){return o.Ec(c),o.pc().task.title=e})),o.ac(),o.ac(),o.bc(12,"div",34),o.bc(13,"div",86),o.bc(14,"div",10),o.bc(15,"label"),o.Oc(16,"Due Date"),o.ac(),o.bc(17,"div",87),o.bc(18,"input",88,89),o.mc("ngModelChange",(function(e){return o.Ec(c),o.pc().taskDueDate=e})),o.ac(),o.bc(20,"div",90),o.bc(21,"button",91),o.mc("click",(function(){return o.Ec(c),o.Dc(19).toggle()})),o.bc(22,"i",92),o.Oc(23,"calendar_today"),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(24,"div",10),o.bc(25,"label"),o.Oc(26,"Description"),o.ac(),o.bc(27,"quill-editor",93),o.mc("ngModelChange",(function(e){return o.Ec(c),o.pc().task.description=e})),o.ac(),o.ac(),o.ac(),o.bc(28,"div",13),o.bc(29,"button",14),o.Oc(30,"Cancel"),o.ac(),o.bc(31,"button",15),o.mc("click",(function(){return o.Ec(c),o.pc().EditTask()})),o.Oc(32," Save"),o.ac(),o.ac(),o.ac()}if(2&c){const c=o.pc();o.Ib(11),o.vc("ngModel",c.task.title),o.Ib(7),o.vc("ngModel",c.taskDueDate),o.Ib(9),o.vc("ngModel",c.task.description),o.Ib(4),o.vc("disabled",!(c.task.title&&c.task.dueDate&&c.task.classId&&c.task.description))}}function V(c,e){if(1&c){const c=o.cc();o.bc(0,"div",4),o.bc(1,"div",5),o.bc(2,"h5",6),o.Oc(3,"New Task"),o.ac(),o.bc(4,"button",7),o.bc(5,"i",8),o.Oc(6,"close"),o.ac(),o.ac(),o.ac(),o.bc(7,"div",9),o.bc(8,"div",10),o.bc(9,"label"),o.Oc(10,"Grade"),o.ac(),o.bc(11,"select",94),o.mc("ngModelChange",(function(e){return o.Ec(c),o.pc().submissionGrade.grade=e})),o.bc(12,"option",95),o.Oc(13,"Choose..."),o.ac(),o.bc(14,"option",96),o.Oc(15,"A +"),o.ac(),o.bc(16,"option",97),o.Oc(17,"A"),o.ac(),o.bc(18,"option",98),o.Oc(19,"A -"),o.ac(),o.bc(20,"option",99),o.Oc(21,"B +"),o.ac(),o.bc(22,"option",100),o.Oc(23,"B"),o.ac(),o.bc(24,"option",101),o.Oc(25,"B -"),o.ac(),o.bc(26,"option",102),o.Oc(27,"C +"),o.ac(),o.bc(28,"option",103),o.Oc(29,"C"),o.ac(),o.bc(30,"option",104),o.Oc(31,"C -"),o.ac(),o.bc(32,"option",105),o.Oc(33,"D"),o.ac(),o.bc(34,"option",106),o.Oc(35,"F"),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(36,"div",13),o.bc(37,"button",14),o.Oc(38,"Cancel"),o.ac(),o.bc(39,"button",107),o.mc("click",(function(){return o.Ec(c),o.pc().GradeSubmission()})),o.Oc(40," Save"),o.ac(),o.ac(),o.ac()}if(2&c){const c=o.pc();o.Ib(11),o.vc("ngModel",c.submissionGrade.grade)}}function K(c,e){if(1&c){const c=o.cc();o.bc(0,"ngx-dropzone-preview",111),o.mc("removed",(function(){o.Ec(c);const a=e.$implicit;return o.pc(2).onRemove(a)})),o.bc(1,"ngx-dropzone-label"),o.Oc(2),o.ac(),o.ac()}if(2&c){const c=e.$implicit;o.vc("removable",!0),o.Ib(2),o.Rc("",c.name," (",c.type,")")}}function Z(c,e){if(1&c){const c=o.cc();o.bc(0,"div",4),o.bc(1,"div",5),o.bc(2,"h5",6),o.Oc(3,"Upload Attachments"),o.ac(),o.bc(4,"button",7),o.bc(5,"i",8),o.Oc(6,"close"),o.ac(),o.ac(),o.ac(),o.bc(7,"div",9),o.bc(8,"div",10),o.bc(9,"ngx-dropzone",108),o.mc("change",(function(e){return o.Ec(c),o.pc().onSelect(e)})),o.bc(10,"ngx-dropzone-label"),o.Oc(11,"Drop Attachments here!"),o.ac(),o.Mc(12,K,3,3,"ngx-dropzone-preview",109),o.ac(),o.bc(13,"span",110),o.Oc(14," * "),o.ac(),o.bc(15,"span"),o.Oc(16,"File size cannot be greater then 5 MB."),o.ac(),o.ac(),o.ac(),o.bc(17,"div",13),o.bc(18,"button",14),o.Oc(19,"Cancel"),o.ac(),o.bc(20,"button",15),o.mc("click",(function(){return o.Ec(c),o.pc().UploadFIles()})),o.Oc(21," Upload"),o.ac(),o.ac(),o.ac()}if(2&c){const c=o.pc();o.Ib(9),o.vc("multiple",!1)("maxFileSize",c.uploadFileSize),o.Ib(3),o.vc("ngForOf",c.files),o.Ib(8),o.vc("disabled",!c.files.length)}}function cc(c,e){if(1&c){const c=o.cc();o.bc(0,"div",4),o.bc(1,"div",5),o.bc(2,"h5",6),o.Oc(3,"Delete Task"),o.ac(),o.bc(4,"button",7),o.bc(5,"i",8),o.Oc(6,"close"),o.ac(),o.ac(),o.ac(),o.bc(7,"div",9),o.bc(8,"p",112),o.Oc(9,"Are you sure you want to remove "),o.bc(10,"strong"),o.Oc(11),o.ac(),o.Oc(12,"?"),o.ac(),o.ac(),o.bc(13,"div",13),o.bc(14,"button",14),o.Oc(15,"Cancel"),o.ac(),o.bc(16,"button",113),o.mc("click",(function(){return o.Ec(c),o.pc().RemoveTask()})),o.Oc(17,"Remove"),o.ac(),o.ac(),o.ac()}if(2&c){const c=o.pc();o.Ib(11),o.Pc(c.task.title)}}const ec=[{path:"",component:A},{path:":taskId",component:(()=>{class c{constructor(c,e,a,t,i,s,n){this.toastr=c,this.taskService=e,this.activatedRoute=a,this.config=t,this.attachmentService=i,this.submissionService=s,this.location=n,this.loading=!0,this.uploadFileSize=this.config.uploadFileSize,this.imgUrl=this.config.imgBaseUrl,this.files=[],this.attachments=[],this.enrollments=[],this.submissions=[],this.submission={link:"",message:"",taskId:""},this.submissionGrade={userId:"",taskId:"",grade:""}}ngOnInit(){this.user=JSON.parse(localStorage.getItem("user")),this.taskId=this.activatedRoute.snapshot.paramMap.get("taskId"),this.getTaskDetail()}getTaskDetail(){this.taskService.getTasks(this.taskId).subscribe(c=>{this.task=c.body,this.attachments=this.task.attachments,this.enrollments=this.task.class.enrollments,this.enrollments.forEach(c=>{c.user.submissions[0]&&(c.user.submissions[0].createdAt=n(c.user.submissions[0].createdAt).format("MMMM DD, YYYY"))});var e=n(this.task.dueDate).format("YYYY-MM-DD"),a={year:Number.parseInt(e.split("-")[0]),month:Number.parseInt(e.split("-")[1]),day:Number.parseInt(e.split("-")[2])};this.task.dueDate=a,this.taskDueDate=a,this.task.dueDateFormatted=n(this.task.dueDate).format("MMMM DD, YYYY"),this.task.createdAt=n(this.task.createdAt).format("MMMM DD, YYYY"),this.loading=!1})}onSelect(c){c.addedFiles.forEach(c=>{0==this.files.length&&(c.size>this.uploadFileSize?this.toastr.error("Please adhere to the file size guidelines"):this.files.push(c))})}onRemove(c){this.files.splice(this.files.indexOf(c),1)}UploadFIles(){var c=new FormData;c.append("classId",this.task.classId),c.append("taskId",this.task.id),this.files.forEach(e=>{c.append("file",e)}),this.attachmentService.addAttachments(c).subscribe(c=>{this.toastr.success("Files Uploaded successfully."),this.files=[],this.getTaskDetail()})}attachmentDelete(c){this.attachmentService.deleteAttachment(c).subscribe(c=>{this.toastr.success("Attachment Removed."),this.getTaskDetail()})}EditTask(){console.log(this.task.dueDate),this.taskService.editTask(this.task.id,{title:this.task.title,description:this.task.description,dueDate:this.taskDueDate.month+"/"+this.taskDueDate.day+"/"+this.taskDueDate.year}).subscribe(c=>{this.toastr.success("Task Detail Updated."),this.getTaskDetail()})}Submit(){var c=JSON.parse(localStorage.getItem("user"));this.submissionService.addSubmission(c.id,this.taskId,{link:this.submission.link,message:this.submission.message}).subscribe(c=>{this.toastr.success("Task Completed."),this.getTaskDetail()})}onGradeModal(c){this.submissionGrade={userId:c.userId,taskId:this.taskId,grade:c.grade},console.log(this.submissionGrade)}GradeSubmission(){JSON.parse(localStorage.getItem("user")),this.submissionService.addSubmission(this.submissionGrade.userId,this.taskId,{grade:this.submissionGrade.grade}).subscribe(c=>{this.toastr.success("Assignment Graded."),this.getTaskDetail()})}RemoveTask(){this.taskService.deleteTask(this.taskId).subscribe(c=>{this.toastr.success("Task has been removed."),this.location.back()})}}return c.\u0275fac=function(e){return new(e||c)(o.Wb(d.b),o.Wb(l.a),o.Wb(s.a),o.Wb(u.a),o.Wb(E.a),o.Wb(N),o.Wb(t.j))},c.\u0275cmp=o.Qb({type:c,selectors:[["app-todo-detail"]],decls:38,vars:9,consts:[["class","page-content",4,"ngIf"],["class","placeholder",4,"ngIf"],["id","markComplete","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["role","document",1,"modal-dialog","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","data-dismiss","modal","aria-label","Close",1,"close"],[1,"material-icons"],[1,"modal-body"],[1,"form-group"],["type","text","placeholder","https://www.dropbox.com/...","name","link",1,"form-control",3,"ngModel","ngModelChange"],["placeholder","Some Text...","name","message",1,"form-control",3,"ngModel","ngModelChange"],[1,"modal-footer"],["type","button","data-dismiss","modal",1,"btn","btn-secondary"],["type","button","data-dismiss","modal",1,"btn","btn-primary",3,"disabled","click"],["id","editTask","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["role","document",1,"modal-dialog","modal-lg","modal-dialog-centered"],["class","modal-content",4,"ngIf"],["id","gardeSubmission","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["id","uploadFiles","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["id","removeTask","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],[1,"page-content"],[1,"page-info"],["aria-label","breadcrumb"],[1,"breadcrumb"],[1,"breadcrumb-item"],[3,"routerLink"],["aria-current","page",1,"breadcrumb-item","active"],[1,"page-options"],["href","javascript:void(0)","class","btn btn-success","data-toggle","modal","data-target","#markComplete",4,"ngIf"],["href","javascript:void(0)","class","btn btn-danger","data-toggle","modal","data-target","#removeTask",4,"ngIf"],["href","javascript:void(0)","class","btn btn-primary","data-toggle","modal","data-target","#editTask",4,"ngIf"],[1,"main-wrapper"],[1,"row"],[1,"col-lg-12"],[1,"card"],[1,"card-body"],[1,"col-md-12"],[1,"card-title"],[3,"innerHTML"],[1,"col-md-2"],[1,"card-title","my-1"],[1,"col-md-10"],[1,"card","card-transparent","file-list"],[1,"card-body","p-0"],[1,"col-md-9"],[1,"card-title","py-3"],[1,"col-md-3"],["href","javascript:void(0)","class","btn btn-primary float-right","data-toggle","modal","data-target","#uploadFiles",4,"ngIf"],["class","row",4,"ngIf"],[1,"text-center"],["class","placeholder","style","margin: 2rem 0;",4,"ngIf"],[1,"card","card-transactions"],[1,"card-body","pt-0"],[1,"table-responsive"],[1,"table","table-striped","table-courses"],["scope","col"],["scope","col",2,"width","20%"],["scope","col",2,"width","15%"],["scope","col",4,"ngIf"],[4,"ngFor","ngForOf"],["href","javascript:void(0)","data-toggle","modal","data-target","#markComplete",1,"btn","btn-success"],["href","javascript:void(0)","data-toggle","modal","data-target","#removeTask",1,"btn","btn-danger"],["href","javascript:void(0)","data-toggle","modal","data-target","#editTask",1,"btn","btn-primary"],["href","javascript:void(0)","data-toggle","modal","data-target","#uploadFiles",1,"btn","btn-primary","float-right"],["class","col-lg-4 col-xl-3",4,"ngFor","ngForOf"],[1,"col-lg-4","col-xl-3"],[1,"card","file","pdf"],["ngbDropdown","",1,"file-options"],["href","javascript:void(0)","ngbDropdownToggle","",1,"dropdown-toggle"],["ngbDropdownMenu","",1,"dropdown-menu","dropdown-menu-right"],["target","blank","download","",1,"dropdown-item",3,"href"],["href","javascript:void(0)",1,"dropdown-item",3,"click"],[1,"card-header","file-icon"],[1,"card-body","file-info"],[1,"placeholder",2,"margin","2rem 0"],["src","assets/images/no-files.png","alt","",2,"width","320px","height","auto"],[4,"ngIf"],["class","text-center",4,"ngIf"],["target","_blank",3,"href"],["href","javascript:void(0)","data-toggle","modal","data-target","#gardeSubmission",3,"click"],[1,"badge","badge-primary"],[1,"placeholder"],["src","assets/images/loader.gif","alt",""],["type","text","id","new-task-name","placeholder","Abc..",1,"form-control",3,"ngModel","ngModelChange"],[1,"col"],[1,"input-group"],["placeholder","yyyy-mm-dd","name","dp","readonly","","ngbDatepicker","",1,"form-control",3,"ngModel","ngModelChange"],["d","ngbDatepicker"],[1,"input-group-append"],["type","button",1,"btn","btn-outline-secondary","calendar","d-flex","align-items-center",3,"click"],[1,"material-icons-outlined"],["name","description","placeholder","Enter project description",1,"quill-textbox",3,"ngModel","ngModelChange"],[1,"form-control",3,"ngModel","ngModelChange"],["value",""],["value","A +"],["value","A"],["value","A -"],["value","B +"],["value","B"],["value","B -"],["value","C +"],["value","C"],["value","C -"],["value","D"],["value","F"],["type","button","data-dismiss","modal",1,"btn","btn-primary",3,"click"],[3,"multiple","maxFileSize","change"],[3,"removable","removed",4,"ngFor","ngForOf"],[1,"text-danger"],[3,"removable","removed"],[1,"mb-0"],["type","button","data-dismiss","modal",1,"btn","btn-danger",3,"click"]],template:function(c,e){1&c&&(o.Mc(0,J,79,15,"div",0),o.Mc(1,H,2,0,"div",1),o.bc(2,"div",2),o.bc(3,"div",3),o.bc(4,"div",4),o.bc(5,"div",5),o.bc(6,"h5",6),o.Oc(7,"Assignment Submission"),o.ac(),o.bc(8,"button",7),o.bc(9,"i",8),o.Oc(10,"close"),o.ac(),o.ac(),o.ac(),o.bc(11,"div",9),o.bc(12,"form"),o.bc(13,"div",10),o.bc(14,"label"),o.Oc(15,"Upload your file to dropbox and paste the link below."),o.ac(),o.bc(16,"input",11),o.mc("ngModelChange",(function(c){return e.submission.link=c})),o.ac(),o.ac(),o.bc(17,"div",10),o.bc(18,"label"),o.Oc(19,"Any Notes?"),o.ac(),o.bc(20,"textarea",12),o.mc("ngModelChange",(function(c){return e.submission.message=c})),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(21,"div",13),o.bc(22,"button",14),o.Oc(23,"Cancel"),o.ac(),o.bc(24,"button",15),o.mc("click",(function(){return e.Submit()})),o.Oc(25,"Submit"),o.ac(),o.ac(),o.ac(),o.ac(),o.ac(),o.bc(26,"div",16),o.bc(27,"div",17),o.Mc(28,_,33,4,"div",18),o.ac(),o.ac(),o.bc(29,"div",19),o.bc(30,"div",3),o.Mc(31,V,41,1,"div",18),o.ac(),o.ac(),o.bc(32,"div",20),o.bc(33,"div",3),o.Mc(34,Z,22,4,"div",18),o.ac(),o.ac(),o.bc(35,"div",21),o.bc(36,"div",3),o.Mc(37,cc,18,1,"div",18),o.ac(),o.ac()),2&c&&(o.vc("ngIf",!e.loading),o.Ib(1),o.vc("ngIf",e.loading),o.Ib(15),o.vc("ngModel",e.submission.link),o.Ib(4),o.vc("ngModel",e.submission.message),o.Ib(4),o.vc("disabled",!e.submission.link||!e.submission.message),o.Ib(4),o.vc("ngIf",!e.loading),o.Ib(3),o.vc("ngIf",!e.loading),o.Ib(3),o.vc("ngIf",!e.loading),o.Ib(3),o.vc("ngIf",!e.loading))},directives:[t.n,i.t,i.j,i.k,i.b,i.i,i.l,s.d,t.m,p.b,p.d,p.c,p.e,g.a,i.q,i.m,i.s,m.a,m.d,m.c],styles:[""]}),c})()}];let ac=(()=>{class c{}return c.\u0275mod=o.Ub({type:c}),c.\u0275inj=o.Tb({factory:function(e){return new(e||c)},imports:[[t.b,i.d,m.b,h.a,p.f,s.e.forChild(ec),g.b.forRoot({modules:{toolbar:[["bold","italic","underline","strike"],["blockquote"],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{size:["small",!1,"large","huge"]}],[{color:[]},{background:[]}],[{align:[]}]]}})]]}),c})()}}]);