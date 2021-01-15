<template>
	<div class="home">
		<!-- 头部 -->
		<div class="container-fluid ">
			<div class="header">
			<div class="row ">
				<div class="col-lg-12 ">
					<nav class="navbar">
							<div class="navbar-header  ">
								<a class="navbar-brand" href="javascript:void(0);">
									<img class="logo" alt="Brand" src="../assets/logo.png">
								</a>
							<span @click="icon_mune">
								<i class="fa fa-align-justify left-menu"></i>
							</span>
							</div>  
							
							<div class="navbar-rigth">
								<span>项目
								<!-- <select v-model="btn_selected" @change="btn_selected!='nacos' ? menu_list(btn_selected) : nacos()"> -->
									<select v-model="btn_selected" @change="menu_list(btn_selected)">
									<option disabled value="">请选择</option>
									<option 
										v-for="(project,index) in project_list" :key="index" :value="project">{{project.Comment}}
									</option>
									<!-- <option value="nacos">nacos</option> -->
								</select>
								</span>
								<span>时区
									<select @change="sle_time" v-model="sle_zone">
										<option disabled value="">请选择</option>
										<option v-for="(item,index) in UTC_ZONE" :key="index" :value="item">{{item}}</option>
									</select>
								</span>
								<!-- <span><a :href="ht+'?num='+user+'&time='+login_time+'&add='+address">nacos</a></span> -->
								<!-- <span><a :href="url+'/nacos/index.html'">nacos</a></span> -->
								<!-- <span><a :href="url+'/sdk/index.html'">wysdk</a></span> -->
								<!-- <span><a :href="url+'/index1.html'">sdk</a></span> -->
								<span>
								<span>欢迎<b class="user_icon">{{username}}</b></span>
								<!-- <span @click="change_psd">修改密码</span> -->
								<span class="out" @click="out">退出</span>
								</span>
							</div>
					</nav>
				</div>
			</div>
		</div>
		<!-- 左侧菜单栏 -->
			<div class="row">
				<div class=" menu " v-if="menu_show">
					<div class=" menu-list-one">{{project_name}}</div>
					<!-- 当点击头部列表时根据不同的接口显示不同的菜单数据 -->
					<div v-for="(menu_data,index) in menu_data" :key="index" :id="'menu_'+index">
						<div @click.capture="change(index)" class="menu-titel">
							<i class="fa fa-caret-right" :class="{'icon':is_icon===index}" aria-hidden="true"></i>
							{{menu_data.name}}
						</div>
						<ul class="menu-list" v-show="is_icon===index" style="margin-top: 10px;">
							<li @click="sty_list(sub,index)" class="menu_list" :class="{'sty_list':is_sty===index}" v-for="(sub,index) in menu_data.sub_item"
							 :key="index"><a :title="sub.name" href="javascript:void(0)" class="list-anchor">{{sub.name}}</a></li>
						</ul>
					</div>
				</div>
				<!-- 加载状态 -->
				<div class="loading" v-if="anate"><i class="fa fa-spin fa-refresh"></i></div>
				<div class="data" :class="[active]">
					<!-- content-admin组件 -->
					<content-admin @lookup="lookup" @child_home="child_home" @child="child" @child_next="child_next" @child_end="child_end"
		 				  @parent_data_sort="parent_data_sort" @parent_refresh="parent_refresh" @query="query" :sub_url="sub_url" :sub_index="sub_index"
		                  :fields="fields" :rows="rows" :project_data="project_data" :response="response" v-if="flag" :istrue="istrue" :isquery="isquery" 
		                  :no_data="no_data" >
					</content-admin>
					<content-warship @lookup="lookup" @child_home="child_home" @child="child" @child_next="child_next" @child_end="child_end"
		 				  @parent_data_sort="parent_data_sort" @parent_refresh="parent_refresh" @query="query" :sub_url="sub_url" :sub_index="sub_index"
		                  :fields="fields" :rows="rows" :project_data="project_data" :response="response" v-if="flag_warship" :istrue="istrue" :isquery="isquery" 
		                  :no_data="no_data" >
					</content-warship>
					<!-- 组件 -->
					<page v-if="box_data.sel" ></page>
					<send-mail v-if="box_data.mail"></send-mail>
					<nacos v-if="box_data.nacos"></nacos>
					<!-- 提示组件 -->
					<tips v-if="sel_tips" :current_state="current_state"></tips>
					<!-- <user-pas></user-pas> -->
					<!-- <router-view></router-view> -->
				</div>
		
			</div>
		</div>
			<div class="row edition">
				<div class="col-lg-12 col-md-12 copyright">版权归玩娱互动</div>
		    </div>
	</div>
</template>
<script>
	//表格数据组件admin
	import contentAdmin from '@/components/content_admin.vue';
	//表格数据组件warship
	import contentWarship from '@/components/content_warship.vue';
	//角色查询组件
	import page from '@/components/page.vue';
	//邮件组件
	import sendMail from '@/components/send_mail.vue';
	//nacos组件
	import nacos from '@/components/nacos';
	//弹框提示组件
	import tips from "../box/tips";
	// import userPas from '@/components/user_psd.vue'
	export default {
		name: 'Home',
		components: {
			contentAdmin,
			contentWarship,
			page,
			sendMail,
			nacos,
			//提示组件
			tips
			// userPas
		},
		data() {
			return {
				// address:'',
				// login_time:'',
				// user:'',
				// ht:'http://10.0.17.119:8082/index.html',
				// flag_head:null,
				// name: "shop",
				// list: 'list_',
				// active: false,
				// menu: "menu",
				//项目下拉框的索引
				project_index:'',
				//是否显示提示组件
				sel_tips:false,
				//当前的状态
				current_state:'',				
				//菜单显示隐藏时的布局
				active:'col-lg-12',
				//菜单的显示和隐藏
				menu_show:false,
				//时区
				UTC_ZONE:[
   					 "UTC-0000",
   					 "UTC-0100",
   					 "UTC-0200",
   					 "UTC-0300",
   					 "UTC-0400",
   					 "UTC-0500",
   					 "UTC-0600",
   					 "UTC-0700",
   					 "UTC-0800",
   					 "UTC-0900",
   					 "UTC-1000",
   					 "UTC-1100",
   					 "UTC-1200",
   					 "UTC+0000",
   					 "UTC+0100",
   					 "UTC+0200",
   					 "UTC+0300",
   					 "UTC+0400",
   					 "UTC+0500",
   					 "UTC+0600",
   					 "UTC+0700",
   					 "UTC+0800",
   					 "UTC+0900",
   					 "UTC+1000",
   					 "UTC+1100",
   					 "UTC+1200"
				],
				//时区选择框的数据
				sle_zone:'UTC+0000',
				//项目的选择框数据
				btn_selected:'',
				//加载状态
				anate:false,				
				//头部请求的数据
				project_list: '',
				//头部数据项目返回的名字
				project_name: '',
				//项目菜单数据包括子菜单
				menu_data: '',
				//控制菜单三角图标
				is_icon: '',
				//用户名
				username: '',
				//菜单项的点击样式
				is_sty: '',
				//角色权限
				userInfo: '',
				//项目内容数据
				rows: [],
				//项目头部数据
				fields: null,
				//项目内容的数据
				project_data: null,
				//头部数据和其他的增删改接口
				response: {},
				//地址路由参数
				sub_url: null,
				//地址路由参数
				sub_index: null,
				list_index: 0,
				//菜单显示隐藏的索引值
				change_index: 0,
				//显示shop组件admin
				flag: false,
				//显示shop组件warship
				flag_warship:false,
				//上下翻页时数据请求完成执行代码
				istrue: {
					isnext: true,
					isfirst: true,
					isstart: true,
					isend: true,
					isrefresh: true,
					isorder: true,
				},
				//是否查询列表数据
				isquery:false,
				//查询的数据参数
				query_projectA:null,
				//请求数据页的显示条数
				data_page: 16,
				//请求的页数默认为一页
				page:1,
				//查询的数据是否为空的标志
				no_data:true,
				//page组件是否显示
				box_data:{
					sel:false,
					mail:false,
					nacos:false
				},
				//获取url中的参数
				surl:null,
				//获取url中的index参数
				index:null,
				//获取url中的子菜单的index
				change_index:null,
				//正反序的状态
				sord:'desc',
				//选择项目的副本
				copy_select:null,
			}
			
		},
		created() {
			//判断是否登录过期
			this.login_expired()
		},
		computed: {},
		mounted() {

			//头部左边状态自动请求头部数据1607504568
			this.getHeadData();
			console.log(this.$route.params.project)
		},
		methods: {                        
			//头部左边状态自动请求头部数据和加载本地保存的数据sessionStorage
			getHeadData(){
				this.axios.get(this.api + '/Login/ProjList').then(res => {
				// console.log(res)
				//获取项目列表
				this.project_list = res.data;
				var select=window.sessionStorage.getItem('btn_selected');
				console.log(select)
				this.copy_select=select;
				// this.btn_selected=this.project_list[0].Name;
				//根据保存的项目为空时会自动请求第一个项目默认显示
				if(select==''){
					// alert(0)
					this.menu_list(this.project_list[0]);
					this.btn_selected=this.project_list[0];
				}else if(select!=''&&this.$route.params.project == undefined){
					alert(0)
					let params_url=window.sessionStorage.getItem('url');
					console.log(params_url)
					params_url=params_url.split(',');
					console.log(params_url)
					this.menu_list(params_url[0]);
					this.getRow(params_url[1],Number(params_url[2]),Number(params_url[3]),params_url[0]);
				}
				//刷新时根据之前保存的时区显示时间
				if(window.sessionStorage.getItem('time_zone')!=null){
					this.sle_zone=window.sessionStorage.getItem('time_zone');
				};
				//当重新加载时请求反序的数据
            	window.sessionStorage.setItem('sord','desc');
				if (this.$route.params.project != undefined) {
					alert(2)
					this.surl = "/" + this.$route.params.project + '/' + this.$route.params.db + '/' + this.$route.params.table;
					this.index = Number(this.$route.params.index);
					this.change_index = Number(this.$route.params.change_index);
					// console.log(this.$route.params.pr)
					// console.log(this.$route.params.pr+this.surl+'/'+this.index+'/'+this.change_index)
					// this.address=encodeURIComponent(this.$route.params.pr+this.surl+'/'+this.change_index+'/'+this.index)
					//刷新时执行头部菜单中的函数并传入路由参数 项目对象 后台路由 菜单索引 子菜单索引
					this.menu_list(this.project_list[select],this.surl, this.index, this.change_index);
					//获取数据时执行的函数 后台路由 菜单索引 子菜单索引 项目对象
					this.getRow(this.surl, this.index, this.change_index,this.project_list[select]);
				}
	
				});
			},
			//登录过期
			login_expired(){
				if(window.sessionStorage.getItem('userInfo')=='null'){
				this.$router.replace({
					path: "/login"
				})
				}else{
				let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
				this.userInfo = userInfo;
				this.username = userInfo.fld_name;
				let startTime = window.sessionStorage.getItem('startTime');
				// this.login_time=encodeURIComponent(window.sessionStorage.getItem('startTime'));
				// console.log(window.sessionStorage.getItem('startTime').toString())
				// console.log(parseInt(startTime/1000))
				let time = parseInt(new Date().getTime() / 1000);
				// console.log(parseInt(time/1000))
				if (userInfo.fld_name == '' || userInfo.fld_name == undefined || userInfo.fld_name == null || userInfo.fld_name ==
					'null') {
					window.sessionStorage.setItem('btn_selected',this.project_index);
					//未完
					window.sessionStorage.setItem('url',this.project_list[this.copy_select]+','+this.surl+','+this.index+','+this.change_index);
					this.$router.replace({
						path: "/login"
					})
					return false;
				};
				let time_control = (time - startTime) - (30 * 60);
				if (time_control > 0) {
					window.sessionStorage.setItem('btn_selected',this.project_index);
					window.sessionStorage.setItem('url',this.project_list[this.copy_select]+','+this.surl+','+this.index+','+this.change_index);
					this.$router.replace({
						path: "/login"
					})
					return false;
				}else{
					startTime = window.sessionStorage.setItem('startTime',time);
				}
				}
			},
			//表格占比
			icon_mune(){
				if(!this.menu_show){
					this.menu_show=true;
					// this.active='col-lg-11 offset-lg-1';
					this.active='true-percentage'
				}else{
					this.menu_show=false;
					this.active='col-lg-12';
					// this.active='false-percentage'
				}
				
			},
			//修改密码
			// change_psd(){},
			//选择时区
			sle_time(){
				//选择时区时根据本地保存时区和正反序列字段重新加载数据
				window.sessionStorage.setItem('time_zone',this.sle_zone);
					if(window.sessionStorage.getItem('sord')!=null){
						this.sord=window.sessionStorage.getItem('sord');
						};
					if (this.$route.params.project != undefined) {
						this.parent_refresh('',this.sord,this.page)
						}
			},
			//计算时区时间
			datetime2zone_x(_date_time, _zone) {
				// console.log(_date_time,_zone)
				// console.log(typeof _date_time)
				const UTC_ZONE = {
				    "UTC-0000": -0 * 3600 * 1000,
				    "UTC-0100": -1 * 3600 * 1000,
				    "UTC-0200": -2 * 3600 * 1000,
				    "UTC-0300": -3 * 3600 * 1000,
				    "UTC-0400": -4 * 3600 * 1000,
				    "UTC-0500": -5 * 3600 * 1000,
				    "UTC-0600": -6 * 3600 * 1000,
				    "UTC-0700": -7 * 3600 * 1000,
				    "UTC-0800": -8 * 3600 * 1000,
				    "UTC-0900": -9 * 3600 * 1000,
				    "UTC-1000": -10 * 3600 * 1000,
				    "UTC-1100": -11 * 3600 * 1000,
				    "UTC-1200": -12 * 3600 * 1000,
				    "UTC+0000": 0 * 3600 * 1000,
				    "UTC+0100": 1 * 3600 * 1000,
				    "UTC+0200": 2 * 3600 * 1000,
				    "UTC+0300": 3 * 3600 * 1000,
				    "UTC+0400": 4 * 3600 * 1000,
				    "UTC+0500": 5 * 3600 * 1000,
				    "UTC+0600": 6 * 3600 * 1000,
				    "UTC+0700": 7 * 3600 * 1000,
				    "UTC+0800": 8 * 3600 * 1000,
				    "UTC+0900": 9 * 3600 * 1000,
				    "UTC+1000": 10 * 3600 * 1000,
				    "UTC+1100": 11 * 3600 * 1000,
				    "UTC+1200": 12 * 3600 * 1000
				};
			    if (!_date_time){
					return "N/A";
					}
					//时区毫秒数
			    var office = UTC_ZONE[_zone];
			    var temp_date = null;
			    if (typeof _date_time == "string") {
					// alert(12)
			        if (_date_time == "1970-01-01 00:00:00"){
						 return "N/A";
					}
			           
					if (_date_time == "0000-00-00 00:00:00"){
						 return "N/A";
					}
			           
			        if (_date_time == "null"){
						return "N/A";
					}
			            // console.log(_date_time)
			        if (_date_time.indexOf("UTC") < 0){
						// alert(1)
						// console.log(111111111111111111)
					_date_time += " UTC+0000";
					//  console.log(_date_time)
					_date_time = _date_time.replace(/\-/g,'/')
					temp_date = new Date(_date_time);
					// console.log(_date_time)
					}
					 
				}else{
						temp_date = _date_time;
					}

			    function to_2_str(_value) {
			        if (_value < 10)
			            return "0" + _value;
			        else
			            return _value;
			    }
			    // console.log(temp_date);
				var temp = new Date(temp_date.getTime() + office);
				// console.log(temp)
			    var date_str = temp.getUTCFullYear()
			        + "-"
			        + to_2_str(temp.getUTCMonth() + 1)
			        + "-"
			        + to_2_str(temp.getUTCDate())
			        + " "
			        + to_2_str(temp.getUTCHours())
			        + ":"
			        + to_2_str(temp.getUTCMinutes())
			        + ":"
			        + to_2_str(temp.getUTCSeconds())
					+ " " + _zone;
					// console.log(date_str)
			    return date_str;
			},
			//nacos
			/*nacos(){
				this.project_name='nacos';
				this.menu_data=[ 
					{name:'配置管理',sub_item:[{name:'坦克',url:'/tank/nacos/serverconfList'},{name:'巅峰战舰',url:'/warship/nacos/serverconfList'}]},
					{name:'服务管理',sub_item:[{name:'坦克',url:'/tank/nacos/groupList'},{name:'巅峰战舰',url:'/warship/nacos/groupList'}]}
				];
			},*/
			//查询数据
			query(url, index,project,sort){	
				this.anate=true;
				this.query_project=project;
				let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
								console.log(res)
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							this.sord=sort;
							};
						// this.sle_time();
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 this.anate=false;
					})
			},
			//获取数据
			getRow(url, index, change_index,pr) {
				// alert(0)
				this.menu_show=false;
				this.active='col-lg-12';
				// console.log(url)
				// &&url!="/tank/nacos/serverconfList"
				// &&url!="/warship/nacos/serverFindList"&&url!="/tank/nacos/groupList"&&url!="/warship/nacos/groupList"
				//当url对应的不是页面的时候直接请求不同的接口使用相同的组件
				if(url!='/Tank/Other/QueryRoles'&&url!="/Tank/Other/SendMail"){					
					let time = new Date().getTime();
					this.anate=true;
					//请求数据列表
					this.axios.post(this.api + '/bin' + url + '/columns', {
					userInfo: this.userInfo
				}).then(res => {
					//将数据赋值给response
					this.response = res.data;
					// console.log(this.response)
					// this.response.FIELDS.forEach(item=>{console.log(item.type)})
					//获取项目的表头数据 项目表格中的标题
					this.fields = res.data.FIELDS;
					//根据表模板的字段显示不同的页面，做定制表的页面
						if(this.response.PAGE_TEMPLATE=="page_grid"){
							this.data_page=parseInt(window.screen.height/60);
						}else if(this.response.PAGE_TEMPLATE=="page_grid_nacos"){
							this.data_page=parseInt(window.screen.height/60);
						}else if(this.response.PAGE_TEMPLATE=="base_page"){
							this.data_page=parseInt(window.screen.height/65)
						}
					//当求情完成的标志
					let parameter={
						_search: false,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: this.response.PRIMARY,
						sord: 'desc',
						}
						parameter.userInfo=JSON.stringify(this.userInfo);
						if(res.data.JQ_GRID_LOAD!=undefined){
							this.axios.post(this.api + res.data.JQ_GRID_LOAD,this.qs.stringify(parameter), {
							headers: {
									'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
								// console.log(res)
								this.project_data = res.data;
									if(res.data.rows!=undefined){
										//求情数据后把类型为时间的加上时区信息
										this.fields.map((ite,index,arr)=>{
											if(ite.FieldType=="datetime"||ite.FieldType=='timestamp'){
												// console.log(ite)
												 	res.data.rows.forEach((item,index)=>{
													//  console.log(this.sle_zone)
													//控制时区函数
													item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
													// console.log(item[ite.Name])
												})
											}
										});
									this.rows = res.data.rows;
									}else{
										this.sel_tips=true;
										this.current_state='没有数据';
										setTimeout(()=>{
											this.sel_tips=false;
										},2000)
									}
								//显示shop组件
								// this.flag_head=true;
								if(this.response.PAGE_TEMPLATE=="page_grid"){
									this.flag = true;
								}else if(this.response.PAGE_TEMPLATE=="page_grid_nacos"){
									this.flag = true;
								}else if(this.response.PAGE_TEMPLATE=="base_page"){
									this.flag_warship = true;
								}
								this.sub_url = url;
								this.sub_index = index;
								// let len = window.history.length;
								//改变小三角样式的函数
								this.change(change_index);
								//子菜单样式
								if (this.is_sty === index) {
									this.is_sty = '';
								} else {
									this.is_sty = index;
								}
								// console.log(pr)
								//项目选择框的数据对象
								this.btn_selected=pr;
								this.anate=false
							})}else{
								this.sel_tips=true;
								this.current_state='没有权限';
								setTimeout(()=>{
									this.sel_tips=false;
								},2000)
							}
						// else{
						// this.flag_head=false;
						// this.flag = true;
						// this.sub_url = url;
						// this.sub_index = index;
						// let len = window.history.length;
						// this.change(change_index);
						// if (this.is_sty === index) {
						// 	this.is_sty = '';
						// } else {
						// 	this.is_sty = index;
						// }
						// this.btn_selected=pr;
						// this.anate=false
						// }
					

				});
				}
			},
			//子组件查找数据点击底部的第几页显示输入框并输入页数
			lookup(url, index, page,sort) {
				//根据是否查询了数据请求不同的接口
				if(this.isquery==true){
					// alert(2)
					this.anate=true;
					this.istrue.isnext = false;
				let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						this.istrue.isnext = true;
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 this.sord=sort;
						 this.anate=false;
					})
				}else{
					// alert(1)
					this.anate=true;
					this.istrue.isnext = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						this.istrue.isnext = true;
						this.anate=false;
						this.sord=sort;
					})
				}
				this.page=page;
			},
			//子组件刷新数据
			parent_refresh(url,sort,page) {
				
				if(this.isquery==true){
					// alert(2)
					this.anate=true;
					this.istrue.isrefresh = false;
					let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						// console.log(res.data)
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							
							};
						// this.sle_time();
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isrefresh = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						this.anate=false;
						this.sord=sort;
						// window.sessionStorage.setItem('sord',sort);
							})
				}else{
					// alert(3)
					this.anate=true;
					this.istrue.isrefresh = false;
				let time = new Date().getTime();
				// console.log(this.response)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						// console.log(res)
						this.project_data = res.data;
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							// console.log(this.rows)
							};
						this.istrue.isrefresh = true;
						this.anate=false;
						this.sord=sort;
					})
				}	
			},
			//子组件调用父组件方法刷新数据正倒序
			parent_data_sort(url, sort) {
					if(this.isquery==true){
					this.anate=true;
					this.istrue.isorder = false;
					let time = new Date().getTime();
					let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							
							};
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isorder = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						this.anate=false;
						//当点击正反序的时候从第一页开始
						this.page=1;
						//在本地存储当前的正反序字段
						window.sessionStorage.setItem('sord',sort);
							})
				}else{
					this.anate=true;
					this.istrue.isorder = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: 1,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						this.istrue.isorder = true;
						this.anate=false;
						this.page=1;
						window.sessionStorage.setItem('sord',sort);
					})
				}
			},
			//首页加载
			child_home(url, index, page,sort) {
				//判断是否是请求的查询接口如果是那么走查询接口如果不是走原始的数据接口
				if(this.isquery==true){	
					this.anate=true;		
					this.istrue.isstart = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isstart = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						if(res.data.rows.length!=0){
							 	this.no_data=true;
						 }
						 this.anate=false;
					})
				}else{
					this.anate=true;
					this.istrue.isstart = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						this.istrue.isstart = true;
						this.anate=false;
					})
				}
			},
			//子组件执行父组件方法上一页
			child(url, index, page,sort) {
				if(this.isquery==true){
					this.anate=true;
					this.istrue.isfirst = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isfirst = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						 if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 this.anate=false;
					})
				}else{
					this.anate=true;
					this.istrue.isfirst = false;
				let time = new Date().getTime();
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
				    	this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						this.istrue.isfirst = true;
						this.anate=false;
					})

				}
				this.page=page;
			},
			//子组件执行父组件方法下一页
			child_next(url, index, page,sort) {
				if(this.isquery==true){
					this.anate=true;
					this.istrue.isnext = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							}
						// this.sle_time();
						// this.time_fn()
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isnext = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						 if(res.data.rows.length==0){
							 	this.no_data=false;
						 }else{
							 this.no_data=true;
						 }
						 this.anate=false;
					})
				}else{
					this.anate=true;
					this.istrue.isnext = false;
				let time = new Date().getTime();
					this.list_index = index;
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
							// console.log(res.data.rows)
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							};
						// this.sle_time();
						// this.time_fn()
						this.istrue.isnext = true;
						this.anate=false;
					})
				}
				this.page=page;
			},
			//尾页加载
			child_end(url, index, page,sort) {
				//如果是查询完成的列表则执行
				if(this.isquery==true){
					this.anate=true;
					//当执行时不能点击尾页的标志
					this.istrue.isend = false;
				let time = new Date().getTime();
				let parameter={
						_search: true,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						filters:this.query_project,
						searchField:'',
						searchString:'',
						searchOper:'',
						}
						parameter.userInfo=JSON.stringify(this.userInfo)
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, this.qs.stringify(parameter),{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'}
							}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							}
						// this.sle_time();
						//当数据请求完成时istrue赋值true此时子组件才能继续请求下一个接口
						this.istrue.isend = true;
						//有查询请求时设置一个标志位用于请求下一页数据传递不同的接口
						this.isquery=true;
						if(res.data.rows.length==0){
							 	this.no_data=false;
						 }
						 this.anate=false;
					})
				}else{//如果不是点击了查询则是所有的数据
				    this.anate=true;
					this.istrue.isend = false;
				let time = new Date().getTime();
					this.list_index = index;
					this.axios.post(this.api + this.response.JQ_GRID_LOAD, {
						_search: false,
						nd: time,
						rows: this.data_page,
						page: page,
						sidx: this.response.PRIMARY,
						sord: sort,
						userInfo: this.userInfo
					}).then(res => {
						this.project_data = res.data;
						// this.rows = res.data.rows;
						//更新时区
						if(res.data.rows!=undefined){
								this.fields.map((ite,index,arr)=>{
									if(ite.FieldType=="datetime"){
										 res.data.rows.forEach((item,index)=>{
											item[ite.Name]=this.datetime2zone_x(item[ite.Name],this.sle_zone);
										})
									}
								});
							this.rows = res.data.rows;
							}
						// this.sle_time();
						this.istrue.isend = true;
						this.anate=false;
					})
				}
				this.page=page;
			},
			//左边菜单栏name:项目对象 url:后台路由 index:菜单索引 chang_index:子菜单索引
			menu_list(name,url, index, change_index) {
				//选中某一项把项目索引赋值给project_index后续使用
				this.project_list.forEach((item,index)=>{
					if(item.Name==name.Name){
						this.project_index=index;
					}
				});
				console.log(name)
				//如果有url字段那么执行外部链接
				if(name.url!=undefined){
					console.log(name.url)
					alert(1)
					// console.log(this.url+name.url)
					 window.location.href=this.url+name.url;return;
				};
					//显示左侧菜单
					this.menu_show=true;
					//控制菜单的显示宽度
					this.active='col-lg-11 offset-lg-1';
					//项目的项目名
					this.project_name = name.Name;
					//项目数据列表的显示标志
					this.flag = false;
					//请求接口时的动画
					this.anate=true;
					//请求项目菜单
					this.axios.get(this.api + '/Login/Menu?Project=' + name.Name).then(res => {
						// console.log(res)
					this.menu_data = res.data;
					this.is_icon = '';
					//如果项目菜单中的子菜单是页面不是数据表执行别的组件
					if(url=='/Tank/Other/QueryRoles'){//查询角色页面
						this.sub_url = url;
						this.sub_index = index;
						let len = window.history.length;
						this.change(change_index);
						if (this.is_sty === index) {
							this.is_sty = '';
						} else {
							this.is_sty = index;
						}
						this.box_data.sel=true;
						this.btn_selected=name;
					}else if(url=="/Tank/Other/SendMail"){//发送邮件页面
						this.sub_url = url;
						this.sub_index = index;
						let len = window.history.length;
						this.change(change_index);
						if (this.is_sty === index) {
							this.is_sty = '';
						} else {
							this.is_sty = index;
						}
						this.box_data.mail=true;
						this.btn_selected=name;
					}
					this.anate=false;
				});
				// }
				// }
				
			},
			//控制菜单栏的显示隐藏
			change(index) {
				this.change_index = index;
				this.is_sty = '';
				if (this.is_icon === index) {
					this.is_icon = '';
				} else {
					this.is_icon = index
				}
			},
			//点击样式
			sty_list(sub, index){
				console.log(this.project_index)
				//每次切换项目就把btn_selected设置为最新的值
				window.sessionStorage.setItem('btn_selected',this.project_index);
				// if(this.response.PAGE_TEMPLATE=="page_grid"||this.$route.params.project == undefined){
					// if(this.response.PAGE_TEMPLATE=="page_grid"){
						window.location.href = this.url + "/home/" + this.project_name + sub.url + '/' + this.change_index + '/' + index;	
					// }
					
				// }
				// if(this.response.PAGE_TEMPLATE=="page_grid"){
				// 	alert(1)
				// }
				// if(this.$route.params.project == undefined){
				// 	alert(2)
				// }
				// 
				// this.$router.push('/'+this.project_name + sub.url + '/' + this.change_index + '/' + index)	
			},
			//退出登录
			out() { 
				// window.sessionStorage.setItem('btn_selected','');
				window.sessionStorage.setItem('btn_selected',this.project_index);
				window.sessionStorage.setItem('url',this.project_list[this.copy_select].Name+','+this.surl+','+this.index+','+this.change_index);
				window.sessionStorage.setItem('userInfo','null');
				console.log(this.copy_select)
				console.log(this.project_list[0])
				console.log(window.sessionStorage.getItem('url'))
				this.$router.replace({
					path: "/login"
				})
			}
		}
	}
</script>
<style scoped>
	@media (min-width: 1024px){
		.true-percentage{
			margin-left: 160px;
			width: 85%;
		}
	}
	@media (min-width: 1100px) {
		.true-percentage{
			margin-left: 160px;
			width: 86%;
		}
	}
	@media (min-width: 1280px) {
		.true-percentage{
			margin-left: 160px;
			width: 89%;
		}
	}
	@media (min-width: 1366px) {

		.true-percentage{
			margin-left: 160px;
			width: 90%;
		}
	}  
	@media (min-width: 1440px) {
		.true-percentage{
			margin-left: 160px;
			width: 90%;
		}
	} 
	@media (min-width: 1680px) {
		.true-percentage{
			margin-left: 160px;
			width: 92%;
		}
	} 
	@media (min-width: 1920px) {
		.true-percentage{
			margin-left: 160px;
			width: 92%;
		}
	} 
    .edition{
		height: 30px;
	}
    .copyright{
	height: 30px;
	line-height: 30px;
	background-color: #969191;
	color: #fff;
	text-align: center;
	margin-bottom: 0px;
	position: fixed;
    margin-left: 15px;
    bottom: 0;
    width: 100%;
	z-index: 2;
}
    .left-menu{
		color:#fff ;
	}
    .user_icon{
		font-family: cursive;
		padding: 0 5px;
        color: #fff;
        font-weight: 400;
	}
	.fa-spin{
	    -webkit-animation: fa-spin 1s infinite linear;
        animation: fa-spin 1s infinite linear;
	}
	.loading{
		z-index: 1;
		font-size: 50px;
		position: fixed;
		color: rgb(138, 132, 132);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	.home{
		overflow: hidden;
	}
     .data{
		 /* margin-top: 20px; */
		 /* width: 100%; */
		 padding-left: 20px;
		 padding-right: 20px;
	 }
	 select{
		font-size: 14px;
	}
    .z_load{
		position: absolute;
		top: 50%;
		left: 50%;
	}
	a {
		color: black;
	}

	a:hover {
		text-decoration: none
	}

	.header {
		position: fixed;
		z-index: 1000;
		width: 100%;
	}

	.container-fluid {
		padding-left: 0;
		padding-right: 0;
	}

	.project_list {
		cursor: pointer;
	}

	.list-anchor {
		display: inline-block;
		height: 40px;
		line-height: 40px;
		width: 100px;
		overflow: hidden;
		white-space: nowrap;
        text-overflow: ellipsis;
	}

	.menu {
		/* width: 10%; */
		z-index: 1;
		background: gainsboro;
		position: fixed;
		top: 52px;
		bottom: 0px;
		overflow: auto;
		/* margin-bottom: 10px; */
		width: 160px;
		padding-right: 0;
	}

	.icon {
		transform: rotate(90deg);
	}

	.navbar-header {
		color: #ffffff;
	}

	.navbar-rigth {
		margin-right: 10px;
		color: #ffffff;
		font-size: 15px;
	}
	.navbar-rigth a{
		color:#fff;
	}
	.active {
		display: block;
	}

	.menu-titel {
		width: 100%;
		text-align: left;
		padding-left: 30px;
		cursor: pointer;
		font-size: 15px;
		/* margin-top: 20px; */
		height: 40px;
		line-height: 40px;
	}

	.menu-titel:hover {
		background: ghostwhite;
	}

	.menu-list {
		margin-left: -40px;
		/* margin-right: -15px; */
	}

	.menu-list li {
		font-size: 13px;
		cursor: pointer;
		padding-left: 52px;
	}

	.menu-list li:hover {
		background-color: ghostwhite;
	}

	.sty_list {
		background-color: ghostwhite;
	}

	.menu-list-one {
		margin-bottom: 10px;
		font-size: 40px;
		text-align: center;
		color: #666;
		font-size: 30px;
	}

	ul li {
		list-style: none;
	}

	.logo {
		width: 117px;
	}

	select {
		outline: none;

	}

	.out {
		cursor: pointer;
	}

	nav {
		padding: 0;
		background: gray;
	}

	span {
		margin-left: 20px;
	}

	.menu::-webkit-scrollbar {
		width: 4px;
	}

	.menu::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(173, 172, 172, 0.2);
		background: rgba(173, 172, 172, 0.2);
	}

	.menu::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(173, 172, 172, 0.2);
		border-radius: 0;
		background: rgba(173, 172, 172, 0.1);

	}
</style>
