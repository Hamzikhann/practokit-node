(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{Bdnu:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var c=t("fXoL"),a=t("tk/3"),s=t("EdIQ");let o=(()=>{class e{constructor(e,n){this.http=e,this.config=n,this.baseUrl=this.config.reqBaseUrl+"courses/"}getCourses(){return this.http.get(this.baseUrl,{observe:"response"})}addCourse(e){return this.http.post(this.baseUrl,e,{observe:"response"})}editCourse(e,n){return this.http.put(this.baseUrl+e,n,{observe:"response"})}deleteCourse(e,n){return this.http.put(this.baseUrl+e+"/status",n,{observe:"response"})}}return e.\u0275fac=function(n){return new(n||e)(c.jc(a.b),c.jc(s.a))},e.\u0275prov=c.Sb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()},CfA1:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var c=t("fXoL"),a=t("tk/3"),s=t("EdIQ");let o=(()=>{class e{constructor(e,n){this.http=e,this.config=n,this.baseUrl=this.config.reqBaseUrl+"classes/"}getClasses(e){return this.http.get(this.baseUrl+"course/"+e,{observe:"response"})}addClass(e){return this.http.post(this.baseUrl,e,{observe:"response"})}editClass(e,n){return this.http.put(this.baseUrl+e,n,{observe:"response"})}deleteClass(e,n){return this.http.put(this.baseUrl+e+"/status",n,{observe:"response"})}}return e.\u0275fac=function(n){return new(n||e)(c.jc(a.b),c.jc(s.a))},e.\u0275prov=c.Sb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()},oSTS:function(e,n,t){"use strict";t.r(n),t.d(n,"AnnouncmentsModule",(function(){return S}));var c=t("ofXK"),a=t("3Pt+"),s=t("tyNb"),o=t("wd/R"),i=t("fXoL"),r=t("tk/3"),d=t("EdIQ");let l=(()=>{class e{constructor(e,n){this.http=e,this.config=n,this.baseUrl=this.config.reqBaseUrl+"announcements/"}getAnnouncements(){return this.http.get(this.baseUrl,{observe:"response"})}addAnnouncements(e){return this.http.post(this.baseUrl,e,{observe:"response"})}editAnnouncements(e,n){return this.http.put(this.baseUrl+e,n,{observe:"response"})}deleteAnnouncements(e,n){return this.http.put(this.baseUrl+e+"/status",n,{observe:"response"})}}return e.\u0275fac=function(n){return new(n||e)(i.jc(r.b),i.jc(d.a))},e.\u0275prov=i.Sb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var b=t("Bdnu"),u=t("CfA1"),m=t("5eHb"),h=t("oOf3");function p(e,n){1&e&&(i.bc(0,"a",34),i.Oc(1,"Create New Announcement"),i.ac())}function g(e,n){1&e&&(i.bc(0,"th",46),i.Oc(1,"Actions"),i.ac())}function f(e,n){if(1&e){const e=i.cc();i.bc(0,"td"),i.bc(1,"a",48),i.mc("click",(function(){i.Ec(e);const n=i.pc().$implicit;return i.pc(2).onModalOpen(n)})),i.Xb(2,"i",49),i.ac(),i.bc(3,"a",50),i.mc("click",(function(){i.Ec(e);const n=i.pc().$implicit;return i.pc(2).onModalOpen(n)})),i.Xb(4,"i",51),i.ac(),i.ac()}}function v(e,n){if(1&e&&(i.bc(0,"tr"),i.bc(1,"td"),i.Oc(2),i.ac(),i.bc(3,"td"),i.Oc(4),i.ac(),i.bc(5,"td"),i.Oc(6),i.ac(),i.Mc(7,f,5,0,"td",47),i.ac()),2&e){const e=n.$implicit,t=i.pc(2);i.Ib(2),i.Pc(e.user.firstName+" "+e.user.lastName),i.Ib(2),i.Pc(e.message),i.Ib(2),i.Pc(e.created_at),i.Ib(1),i.vc("ngIf","Teacher"==t.user.role.title)}}function I(e,n){if(1&e){const e=i.cc();i.bc(0,"pagination-controls",52),i.mc("pageChange",(function(n){return i.Ec(e),i.pc(2).p=n})),i.ac()}}const M=function(e){return{itemsPerPage:10,currentPage:e}};function O(e,n){if(1&e&&(i.bc(0,"div",35),i.bc(1,"div",36),i.bc(2,"div",37),i.bc(3,"div",38),i.bc(4,"div",39),i.bc(5,"table",40),i.bc(6,"thead"),i.bc(7,"tr"),i.bc(8,"th",41),i.Oc(9,"Instructor"),i.ac(),i.bc(10,"th",42),i.Oc(11,"Message"),i.ac(),i.bc(12,"th",41),i.Oc(13,"Timestamp"),i.ac(),i.Mc(14,g,2,0,"th",43),i.ac(),i.ac(),i.bc(15,"tbody"),i.Mc(16,v,8,4,"tr",44),i.qc(17,"paginate"),i.ac(),i.ac(),i.ac(),i.ac(),i.ac(),i.Mc(18,I,1,0,"pagination-controls",45),i.ac(),i.ac()),2&e){const e=i.pc();i.Ib(14),i.vc("ngIf","Teacher"==e.user.role.title),i.Ib(2),i.vc("ngForOf",i.sc(17,3,e.announcements,i.zc(6,M,e.p))),i.Ib(2),i.vc("ngIf",e.announcements.length>10)}}function A(e,n){1&e&&(i.bc(0,"div",53),i.Xb(1,"img",54),i.bc(2,"p"),i.Oc(3,"No Announcements found"),i.ac(),i.ac())}function C(e,n){1&e&&(i.bc(0,"div",53),i.Xb(1,"img",55),i.ac())}function y(e,n){if(1&e&&(i.bc(0,"option",56),i.Oc(1),i.ac()),2&e){const e=n.$implicit;i.wc("value",e.id),i.Ib(1),i.Qc("",e.name," ")}}function k(e,n){if(1&e&&(i.bc(0,"option",56),i.Oc(1),i.ac()),2&e){const e=n.$implicit;i.wc("value",e.id),i.Ib(1),i.Qc(" ",e.title," ")}}const w=function(){return["/"]},U=[{path:"",component:(()=>{class e{constructor(e,n,t,c){this.announcementService=e,this.courseService=n,this.classService=t,this.toastr=c,this.loading=!0,this.p=1,this.announcement={message:"",courseId:"",classId:""},this.selected_announcement={id:"",message:"",created_at:""},this.announcements=[],this.courses=[],this.sessions=[]}ngOnInit(){this.user=JSON.parse(localStorage.getItem("user")),this.getAnnouncements(),this.getCourses()}getAnnouncements(){this.announcementService.getAnnouncements().subscribe(e=>{this.announcements=e.body,this.announcements.forEach(e=>{e.created_at=o(e.created_at).format("MMMM DD, YYYY")}),this.loading=!1})}getCourses(){this.courseService.getCourses().subscribe(e=>{this.courses=e.body})}getSessions(){this.classService.getClasses(this.announcement.courseId).subscribe(e=>{this.sessions=e.body,this.sessions.forEach(e=>{var n=e.timing.split(" - ")[0],t=e.timing.split(" - ")[1];e.startTime=n.split(":")[0]>12?n.split(":")[0]-12+":"+n.split(":")[1]+" PM":n+" AM",e.endTime=t.split(":")[0]>12?t.split(":")[0]-12+":"+t.split(":")[1]+" PM":t+" AM",e.title=e.title+" ( "+e.startTime+" - "+e.endTime+" )"})})}onAddAnnouncement(){this.announcementService.addAnnouncements({message:this.announcement.message,classId:this.announcement.classId}).subscribe(e=>{this.toastr.success("Announcement created."),this.announcement={message:"",courseId:"",classId:""},this.getAnnouncements()})}onEditAnnouncement(){this.announcementService.editAnnouncements(this.selected_announcement.id,{message:this.selected_announcement.message}).subscribe(e=>{this.toastr.success("Announcement Updated."),this.getAnnouncements()})}onDeleteAnnouncement(){this.announcementService.deleteAnnouncements(this.selected_announcement.id,{status:"N"}).subscribe(e=>{this.toastr.success("Announcement Deleted."),this.getAnnouncements()})}onModalOpen(e){this.selected_announcement={id:e.id,message:e.message,created_at:e.created_by}}}return e.\u0275fac=function(n){return new(n||e)(i.Wb(l),i.Wb(b.a),i.Wb(u.a),i.Wb(m.b))},e.\u0275cmp=i.Qb({type:e,selectors:[["app-announcements"]],decls:85,vars:16,consts:[[1,"page-content"],[1,"page-info"],["aria-label","breadcrumb"],[1,"breadcrumb"],[1,"breadcrumb-item"],[3,"routerLink"],["aria-current","page",1,"breadcrumb-item","active"],["data-toggle","modal","data-target","#newTask",1,"page-options"],["href","javascript:void(0)","class","btn btn-primary",4,"ngIf"],[1,"main-wrapper"],["class","row",4,"ngIf"],["class","placeholder",4,"ngIf"],["id","newTask","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["role","document",1,"modal-dialog","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],[1,"far","fa-bell","mr-2"],["type","button","data-dismiss","modal","aria-label","Close",1,"close"],[1,"material-icons"],[1,"modal-body"],[1,"form-group"],[1,"form-control",3,"ngModel","ngModelChange"],["selected","","disabled",""],[3,"value",4,"ngFor","ngForOf"],[1,"form-control",3,"ngModel","disabled","ngModelChange"],["placeholder","Add Announcement ...","maxlength","512",1,"form-control",3,"ngModel","ngModelChange"],[1,"modal-footer"],["type","button","data-dismiss","modal",1,"btn","btn-secondary"],["type","button","data-dismiss","modal",1,"btn","btn-primary",3,"disabled","click"],["id","editTask","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],["id","deleteTask","tabindex","-1","role","dialog","aria-labelledby","exampleModalLabel","aria-hidden","true",1,"modal","fade"],[1,"form-control"],["type","button","data-dismiss","modal",1,"btn","btn-primary",3,"click"],["href","javascript:void(0)",1,"btn","btn-primary"],[1,"row"],[1,"col-lg-12"],[1,"card","card-transactions"],[1,"card-body","pt-0"],[1,"table-responsive"],[1,"table","table-striped"],["scope","col",2,"width","20%"],["scope","col"],["scope","col","width","10%",4,"ngIf"],[4,"ngFor","ngForOf"],["class","inbox-pagination",3,"pageChange",4,"ngIf"],["scope","col","width","10%"],[4,"ngIf"],["href","javascript:void(0)","data-toggle","modal","data-target","#editTask",1,"mx-2",3,"click"],[1,"fas","fa-edit","pr-2"],["href","javascript:void(0)","data-toggle","modal","data-target","#deleteTask",3,"click"],[1,"fas","fa-trash-alt"],[1,"inbox-pagination",3,"pageChange"],[1,"placeholder"],["src","assets/images/no-data.png","alt",""],["src","assets/images/loader.gif","alt",""],[3,"value"]],template:function(e,n){1&e&&(i.bc(0,"div",0),i.bc(1,"div",1),i.bc(2,"nav",2),i.bc(3,"ol",3),i.bc(4,"li",4),i.bc(5,"a",5),i.Oc(6,"Dashboard"),i.ac(),i.ac(),i.bc(7,"li",6),i.Oc(8,"Announcements"),i.ac(),i.ac(),i.ac(),i.bc(9,"div",7),i.Mc(10,p,2,0,"a",8),i.ac(),i.ac(),i.bc(11,"div",9),i.Mc(12,O,19,8,"div",10),i.Mc(13,A,4,0,"div",11),i.Mc(14,C,2,0,"div",11),i.ac(),i.ac(),i.bc(15,"div",12),i.bc(16,"div",13),i.bc(17,"div",14),i.bc(18,"div",15),i.bc(19,"h5",16),i.Xb(20,"i",17),i.Oc(21,"New Announcement "),i.ac(),i.bc(22,"button",18),i.bc(23,"i",19),i.Oc(24,"close"),i.ac(),i.ac(),i.ac(),i.bc(25,"div",20),i.bc(26,"div",21),i.bc(27,"label"),i.Oc(28,"Course"),i.ac(),i.bc(29,"select",22),i.mc("ngModelChange",(function(e){return n.announcement.courseId=e}))("ngModelChange",(function(){return n.getSessions()})),i.bc(30,"option",23),i.Oc(31,"Select"),i.ac(),i.Mc(32,y,2,2,"option",24),i.ac(),i.ac(),i.bc(33,"div",21),i.bc(34,"label"),i.Oc(35,"Class"),i.ac(),i.bc(36,"select",25),i.mc("ngModelChange",(function(e){return n.announcement.classId=e})),i.bc(37,"option",23),i.Oc(38,"Select"),i.ac(),i.Mc(39,k,2,2,"option",24),i.ac(),i.ac(),i.bc(40,"div",21),i.bc(41,"textarea",26),i.mc("ngModelChange",(function(e){return n.announcement.message=e})),i.Oc(42,"                    "),i.ac(),i.ac(),i.ac(),i.bc(43,"div",27),i.bc(44,"button",28),i.Oc(45,"Cancel"),i.ac(),i.bc(46,"button",29),i.mc("click",(function(){return n.onAddAnnouncement()})),i.Oc(47,"Add"),i.ac(),i.ac(),i.ac(),i.ac(),i.ac(),i.bc(48,"div",30),i.bc(49,"div",13),i.bc(50,"div",14),i.bc(51,"div",15),i.bc(52,"h5",16),i.Xb(53,"i",17),i.Oc(54,"Edit Announcement "),i.ac(),i.bc(55,"button",18),i.bc(56,"i",19),i.Oc(57,"close"),i.ac(),i.ac(),i.ac(),i.bc(58,"div",20),i.bc(59,"div",21),i.bc(60,"textarea",26),i.mc("ngModelChange",(function(e){return n.selected_announcement.message=e})),i.ac(),i.ac(),i.ac(),i.bc(61,"div",27),i.bc(62,"button",28),i.Oc(63,"Cancel"),i.ac(),i.bc(64,"button",29),i.mc("click",(function(){return n.onEditAnnouncement()})),i.Oc(65,"Update"),i.ac(),i.ac(),i.ac(),i.ac(),i.ac(),i.bc(66,"div",31),i.bc(67,"div",13),i.bc(68,"div",14),i.bc(69,"div",15),i.bc(70,"h5",16),i.Xb(71,"i",17),i.Oc(72,"Delete Announcement "),i.ac(),i.bc(73,"button",18),i.bc(74,"i",19),i.Oc(75,"close"),i.ac(),i.ac(),i.ac(),i.bc(76,"div",20),i.bc(77,"div",21),i.bc(78,"div",32),i.Oc(79),i.ac(),i.ac(),i.ac(),i.bc(80,"div",27),i.bc(81,"button",28),i.Oc(82,"Cancel"),i.ac(),i.bc(83,"button",33),i.mc("click",(function(){return n.onDeleteAnnouncement()})),i.Oc(84,"Delete"),i.ac(),i.ac(),i.ac(),i.ac(),i.ac()),2&e&&(i.Ib(5),i.vc("routerLink",i.yc(15,w)),i.Ib(5),i.vc("ngIf","Teacher"==n.user.role.title),i.Ib(2),i.vc("ngIf",n.announcements.length),i.Ib(1),i.vc("ngIf",!n.announcements.length&&!n.loading),i.Ib(1),i.vc("ngIf",n.loading),i.Ib(15),i.vc("ngModel",n.announcement.courseId),i.Ib(3),i.vc("ngForOf",n.courses),i.Ib(4),i.vc("ngModel",n.announcement.classId)("disabled",!n.announcement.courseId),i.Ib(3),i.vc("ngForOf",n.sessions),i.Ib(2),i.vc("ngModel",n.announcement.message),i.Ib(5),i.vc("disabled",!n.announcement.message||!n.announcement.classId),i.Ib(14),i.vc("ngModel",n.selected_announcement.message),i.Ib(4),i.vc("disabled",!n.selected_announcement.message),i.Ib(15),i.Pc(n.selected_announcement.message))},directives:[s.d,c.n,a.q,a.i,a.l,a.m,a.s,c.m,a.b,a.e,h.c],pipes:[h.b],styles:[""]}),e})()}];let S=(()=>{class e{}return e.\u0275mod=i.Ub({type:e}),e.\u0275inj=i.Tb({factory:function(n){return new(n||e)},imports:[[c.b,a.d,h.a,s.e.forChild(U)]]}),e})()}}]);