let vm=new Vue({
    el: '#app',
    components: {
        
    },
    data: {
        show_tips:null,
        reversal: '',
        reversal1: '',
        isActive: false,
        isItemList: false,
        isItemList1: false,
        isItemList2: false,
        projectList: "",//获取项目列表
        heo: true,
        sty: '',
        pro: '',
        temprojectid:"a",
        shows:0,
        index:'',
        user:"",
        fld_username:"",
        userInfo:"",
        current_state:'没有权限',
        show_tips_box:false,
        add:'',
        //项目管理的列表
        project_management:null,
    },

    mounted:function() {
        var user,time,startTime,add;
            user=sessionStorage.getItem('userInfo');
            time=parseInt(new Date().getTime()/1000);
            startTime=sessionStorage.getItem('startTime');
            this.userInfo=user;
        // }
        if(user==""||user==null ||user==undefined ||user=='null'){
            window.location.href="/login";
            return false;
        }
        
        
        var timeCha=(time-startTime)-(30*60);
        if(timeCha>0){
            sessionStorage.setItem('user',null);
            window.location.href="/login";
            return false;
        }
        var userObj=JSON.parse(user);
        this.getAuth();
        this.fld_username=userObj.fld_name;
        this.getProject();
    },
    computed:{
        
    },
    methods: {
        //获取项目列表
        getProject: function () {
            axios
                .post(serverUrl+'/sdk/projectList',{userInfo:this.userInfo})
                .then(response => {
                    if(response.data.error==-1){
                        // alert(response.data.message);
                        return false;
                    }else{
                        this.projectList = response.data.projectList;
                    }
                    
                })
        },
        getProjectId: function (e) {
            
            this.temprojectid=e.toElement.attributes.projectId.value;
            //console.log(this.temprojectid);

        },
        //是否显示子菜单
        config_fn: function () {
            if (!this.isItemList) {
                this.isItemList = true;
                this.isItemList1 = false;
                this.isItemList2 = false
            } else {
                this.isItemList = false
            }
        },
        server_fn: function () {
            if (!this.isItemList1) {
                this.isItemList1 = true;
                this.isItemList = false;
                this.isItemList2 = false
            } else {
                this.isItemList1 = false
            }
        },
        group_fn: function () {
            if (!this.isItemList2) {
                this.isItemList2 = true;
                this.isItemList = false;
                this.isItemList1 = false;
                // axios.post(serverUrl+'/sdk/projectList',{userInfo:this.userInfo}).then((res)=>{
                //     this.project_management=res.data.projectList;
                // })
            } else {
                this.isItemList2 = false
            }

        },
        change: function (index,e) {
            // alert(1)
            var controller=e.target.attributes.controller.value;
            
            if(controller=="slc"){
                var projectId=e.target.attributes.projectid.value;
                
                var projectName=$("#pid_"+projectId).html();
                // console.log(projectName,projectId)
                $("#iframe").attr("src","serverList.html?projectId="+projectId+"&project="+projectName+index);

                window.location.href=window.location.pathname+"#type="+escape('配置')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
             }
            //else if(controller=="glc"){
            //     $("#iframe").attr("src","group.html");
            //     window.location.href=window.location.pathname+"#type="+escape('分组'+'&count='+index);
            // }else if(controller=="nlc"){
            //     $("#iframe").attr("src","namespace.html");
            //     window.location.href=window.location.pathname+"#type="+escape('命名空间'+'&count='+index);
            // }else if(controller=="prlc"){
            //     $("#iframe").attr("src","project.html");
            //     window.location.href=window.location.pathname+"#type="+escape('项目管理'+'&count='+index);
            // }
            else if(controller=="sflc"){
                var projectId=e.target.attributes.projectid.value;
                var projectName=$("#pid_"+projectId).html();
                //projectName=escape(projectName);

                $("#iframe").attr("src","serverFindList.html?projectId="+projectId+"&project="+projectName);
                window.location.href=window.location.pathname+"#type="+escape('服务')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            }
            // else if(controller=="zflc"){
            //     var projectId=e.target.attributes.projectid.value;
            //     var projectName=$("#pid_"+projectId).html();
            //     //projectName=escape(projectName);

            //     $("#iframe").attr("src","group.html?projectId="+projectId+"&project="+projectName);
            //     window.location.href=window.location.pathname+"#type="+escape('管理')+'&name='+escape(projectName)+'&id='+projectId+'&count='+index;
            // }
            // else if(controller=="ulc"){
            //     $("#iframe").attr("src","user-admin.html");
            //     window.location.href=window.location.pathname+"#type="+escape('用户管理'+'&count='+index);

            // }
            else if(controller=="prlc"){
                // alert(0)
                $("#iframe").attr("src","project.html");
                window.location.href=window.location.pathname+"#type="+escape('角色管理'+'&count='+index);
            }
            this.shows=index;
        },
        change1: function () {
            this.reversal1 = true
        },
        triangle: function () {
            this.heo = '';
            this.sty = true

        },
        back: function () {
            this.pro = true;
            let oldProcedure = this.$refs['procedureEdit'].getVal();
            oldProcedure='';
            // alert()
        },
        //退出登陆
        // logout:function(){
        //     sessionStorage.setItem('user',null);
        //     window.location.href="./login.html";
        //     return false;

        // },

        /**
         * 
         * 获取表权限
         */
        getAuth:function(){
            axios
            .post(serverUrl+'/sdk/getUserAuth',
            {
                TBName:"tbl_project",
                userInfo:this.userInfo
            })
            .then(response => {
                // console.log("response.data.rule",response.data.rule); 
                if(response.data.rule.View==true){
                    this.show_tips=true;
                }else{
                    this.show_tips_box=true;
                    window.setTimeout(()=>{
                        this.show_tips_box=false;
                    },3000)
                }  
            })
        }
    },
})