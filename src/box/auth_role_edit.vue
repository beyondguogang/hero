<template>
  <div class="sel" v-drag >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title">--auth role edit--</span>
        <span aria-hidden="true" class="modal-span" @click="close">&times;</span>
      </div>
      <div class="modal-body">
            <form class="form-inline">
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">项目</label>
                   <!-- @change="select_project" -->
                  <select class="form-control" v-model="selected" @change="select_project">
                      <option disabled value="">请选择</option>
                      <option v-for="(list,index) in proj" :key="index" :value="list">{{list}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">类型</label>
                   <!-- @change="select_type" -->
                  <select class="form-control" v-model="selected_type" @change="select_type">
                      <option disabled value="">请选择</option>
                      <option v-for="(list,index) in data_type" :key="index" :value="list">{{list}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputName2" class="lab">数据库</label>
                   <!-- @change="select_db" -->
                  <select class="form-control" v-model="selected_db" @change="select_db">
                      <option disabled value="">请选择</option>
                      <option v-for="(list,index) in data_base" :key="index" :value="list">{{list}}</option>
                  </select>
                </div>
            </form>
            <div class="box-table" @scroll="table_cont">
              <table class="table table-hover text-nowrap">
                    <thead class="th" :style="{transform:'translateY('+tans_late+'px)'}">
                    <tr>
                      <th><label>项目(工程)</label></th>
                      <th><label>类型</label></th>
                      <th><label>数据库</label></th>
                      <th><label>表(页面)</label></th>
                      <th><label>说明</label></th>
                      <th><label>浏览<input type="checkbox" id="browse" v-model="parent.browse" @change="cahnge_browse"></label></th>
                      <th><label>增加<input type="checkbox" v-model="parent.increase" @change="change_increase"></label></th>
                      <th><label>删除<input type="checkbox" v-model="parent.del" @change="change_del"></label></th>
                      <th><label>修改<input type="checkbox" v-model="parent.modify" @change="change_modify"></label></th>
                      <th><label>数据权限</label></th>
                    </tr>
                  </thead> 
                    <tbody class="t-body">
                    <tr v-for="(list,index) in res_data" :key="index">
                      <td>{{list.Project}}</td>
                      <td>{{list.Type}}</td>
                      <td>{{list.DBase}}</td>
                      <td>{{list.Table}}</td>
                      <td>{{list.Comment}}</td>
                      <td><input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'View'" v-model="child.child_browse" @click="change_child_browse(list,index)"></td>
                      <td><input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'Add'" v-if="show_data[index]" v-model="child.child_increase" @click="change_child_increase(list,index)"></td>
                      <td><input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'Del'" v-if="show_data[index]" v-model="child.child_del" @click="change_child_del(list,index)"></td>
                      <td><input class="inp-check" type="checkbox" :value="list.Project+list.Type+list.DBase+list.Table+'Update'" v-if="show_data[index]" v-model="child.child_modify" @click="change_child_modify(list,index)"></td>
                      <td><span v-if="list.Type=='TABLE'"><input type="text" v-model="input_data[index]" class="data-input"><span class="serch-box" @click="serch_box(index)"><i class="fa fa-ellipsis-h fa-1x "></i></span></span></td>  
                    </tr>   
                  </tbody>                                                       
              </table>
            </div>   
      </div>
      <div class="modal-footer">
        <div class="cole">
          <button type="button" class="btn btn-default btn-default-close" data-dismiss="modal" @click="cancel">取消</button>
        </div>                 
        <div class="shou">
          <button type="button" class="btn btn-default-determine" @click="confirm">确定</button>
        </div> 
        <!-- 加载状态 -->
      <div class="loading" v-if="anate"><i class="fa fa-spin fa-spinner"></i></div>
      </div>
    </div>
  </div>
  <!-- 数据权限组件 -->
  <!-- <data-permission-list v-if="true" :columns="columns" :data_list="data_list"></data-permission-list> -->
  <data-permission-list v-if="flag" :project="project" :db="db" :table="table" @close_box='close_box' @confirm_data="confirm_data"></data-permission-list>
  </div>
</template>
<script>
import dataPermissionList from "../plug/data_permission.vue"
export default {
  name:'sel',
  data () {
    return {
            index:null,
            //输入框中的数据
            input_data:[],
            flag:false,
            //公共的用户信息
            userInfo:'',
            //选择框的响应数据
            selected:'',
            //数据类型响应数据
            selected_type:'',
            //数据库响应数据
            selected_db:'',
            //返回的数据数组
            res_data:'',
            //项目列表选择框筛选需要的res_data副本
            res_data_repeat:'',
            //选择项目
            proj:['ALL'],
            //数据类型
            data_type:['所有'],
            //列表数据库
            data_base:['ALL'],
            //是否显示复选框
            show_data:[],
            obj:{},
            //父复选框对象
           parent:{
            //浏览
            browse:'',
            //增加
            increase:'',
            //删除
            del:'',
            //修改
            modify:''
            },
            //子复选框对象
           child:{
            //子浏览
            child_browse:[],
            //子增加
            child_increase:[],
            //子删除
            child_del:[],
            //子修改
            child_modify:[]
           },
           //复选框对应的值
           btn_value:{
             browse_value:'',
             increase_value:'',
             del_value:'',
             modify_value:''
           },
           child_rule_data:this.rule_data,
           //加载状态
           anate:true,
            //距离头部的位置
           tans_late:'',
           //三点的头部数据
           //columns:null,
           //三点的数据列表
           //data_list:null,
           //每条数据需获取的项目名
           project:null,
           //每条数据的数据库名
           db:null,
           //每条数据的表
           tabel:null
    }
  },
  props: {
    ppr_action:String,
    ppr_action_param:String,
    item_fun:String,
    rule_data:String
  },
  components:{
    dataPermissionList
  },
 computed: {
  },
  created(){
    this.get_data();
  },
  mounted () {
    alert('authRoleEdit')
  },
  methods: {
    //提交选中项
    confirm_data(data){
      this.input_data[this.index]=data;
      this.flag=false;
    },
    //关闭弹框组件
    close_box(){
      this.flag=false
    },
    //当点击三个点时显示组件弹框
    serch_box(index){
      // alert(1)
      // console.log(this.res_data)
      this.index=index;
      this.project=this.res_data[index].Project;
      this.db=this.res_data[index].DBase;
      this.table=this.res_data[index].Table
      window.setTimeout(()=>{
        this.flag=true;
      },0);
      this.flag=false;
    },
    //固定表头
    table_cont(e){
				// alert(1)
				this.tans_late=e.target.scrollTop;
				// console.log(e.target.scrollTop)
				},
    //复选框中选中的项目
    btn_chected(){
      if(this.child_rule_data!=''){
        this.child_rule_data=JSON.parse(this.child_rule_data);
      //获取对象中所有的属性（数组形式的key）
      let arrProject=Object.keys(this.child_rule_data);
      //第一次循环项目结果
      if(arrProject.length>0){
        arrProject.forEach((item,index)=>{
          //获取所有的type的key
          var arrType=Object.keys(this.child_rule_data[item]);          
            arrType.forEach((item1,index)=>{
              //获取所有的website的key
              var arrWebsite=Object.keys(this.child_rule_data[item][item1])
              arrWebsite.forEach((item2,index)=>{
                //获取所有的table的key
               var arrPage=Object.keys(this.child_rule_data[item][item1][item2])
               arrPage.forEach((item3,index)=>{
                 //获取所有的选中复选框的key
               var arrViue=Object.keys(this.child_rule_data[item][item1][item2][item3])
               if(arrViue.length==0){
                 this.child.child_browse.push(item+item1+item2+item3);
                 this.parent.browse=true;
               }else{
                 arrViue.forEach((item4,index1)=>{
                 if(item1=='DBase'){
                    let item1_1='TABLE'
                    if(item4=="View"){
                      this.child.child_browse.push(item+item1_1+item2+item3+item4);
                      this.parent.browse=true;
                    }
                    if(item4=="Add"){
                      this.child.child_increase.push(item+item1_1+item2+item3+item4);
                      this.parent.increase=true;
                    }
                    if(item4=="Del"){
                      this.child.child_del.push(item+item1_1+item2+item3+item4);
                      this.parent.del=true;
                    }
                     if(item4=="Update"){
                      this.child.child_modify.push(item+item1_1+item2+item3+item4);
                      this.parent.modify=true;
                    }
                    if(item4=='Recordld'){
                      this.input_data[index]=this.child_rule_data[item][item1][item2][item3][item4];
                    }
               }else{
                    if(item4=="View"){
                      this.child.child_browse.push(item+item1_1+item2+item3+item4);
                      this.parent.browse=true;
                    }
                    if(item4=="Add"){
                      this.child.child_increase.push(item+item1_1+item2+item3+item4);
                      this.parent.increase=true;
                    }
                    if(item4=="Del"){
                      this.child.child_del.push(item+item1_1+item2+item3+item4);
                      this.parent.del=true;
                    }
                     if(item4=="Update"){
                      this.child.child_modify.push(item+item1_1+item2+item3+item4);
                      this.parent.modify=true;
                    }
               }
               })
               }
               })
              })
            })
        })
      }
      }else{
        return false
      }
      
    },
   //浏览总复选框  
    cahnge_browse(){
      if(this.parent.browse==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"View";
          let sum=this.child.child_browse.every((item)=>{
              return item!=view
            })
          if(this.child.child_browse.length==0){
            this.child.child_browse.push(view);
            
          }else if(sum){
            this.child.child_browse.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"View";
            this.child.child_browse=this.child.child_browse.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //增加总复选框
    change_increase(){
      if(this.parent.increase==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"Add";
          let sum=this.child.child_increase.every((item,i)=>{
              return item!=view
            })
          if(this.child.child_increase.length==0){
            this.child.child_increase.push(view);
          }else if(sum){
            this.child.child_increase.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"Add";
            this.child.child_increase=this.child.child_increase.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //删除总复选框
    change_del(){
      if(this.parent.del==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"Del";
          let sum=this.child.child_del.every((item,i)=>{
              return item!=view
            })
          if(this.child.child_del.length==0){
            this.child.child_del.push(view);
            
          }else if(sum){
            this.child.child_del.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"Del";
            this.child.child_del=this.child.child_del.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //修改总复选框
    change_modify(){
      if(this.parent.modify==true){
        this.res_data_repeat.forEach((i,index)=>{
          var view=i.Project+i.Type+i.DBase+i.Table+"Update";
          let sum=this.child.child_modify.every((item,i)=>{
              return item!=view
            })
          if(this.child.child_modify.length==0){
            this.child.child_modify.push(view);
            
          }else if(sum){
            this.child.child_modify.push(view);
          }
        })
      }else{
          this.res_data_repeat.forEach((i,index)=>{
            var view=i.Project+i.Type+i.DBase+i.Table+"Update";
            this.child.child_modify=this.child.child_modify.filter((item,index)=>{
              return view!=item;
            })
          })
        }
    },
    //浏览复选框
     change_child_browse(i,ind){
      var view=i.Project+i.Type+i.DBase+i.Table+"View";
      let sum=this.child.child_browse.every((item,index)=>{
        return item!=view
      })
      if(this.child.child_browse.length==0){
        this.child.child_browse.push(view);
      }else if(sum){
        this.child.child_browse.push(view);
      }else{
        this.child.child_browse=this.child.child_browse.filter((item,index)=>{
          return view!=item;
        })
      };
      if(this.child.child_browse.length>0){
        this.parent.browse=true;
      };
      if(this.child.child_browse.length==0){
        this.parent.browse=false
      }
       console.log(this.child.child_browse)
     },
    //增加复选框
    change_child_increase(i){
      var view=i.Project+i.Type+i.DBase+i.Table+"Add";
      let sum=this.child.child_increase.every((item,index)=>{
        return item!=view
      })
      if(this.child.child_increase.length==0){
        this.child.child_increase.push(view);
      }else if(sum){
        this.child.child_increase.push(view);
      }else{
        this.child.child_increase=this.child.child_increase.filter((item,index)=>{
          return view!=item;
        })
      };
      if(this.child.child_increase.length>0){
        this.parent.increase=true;
      };
      if(this.child.child_increase.length==0){
        this.parent.increase=false
      }
    },
    //删除复选框
    change_child_del(i){
      var view=i.Project+i.Type+i.DBase+i.Table+"Del";
      let sum=this.child.child_del.every((item,index)=>{
        return item!=view
      })
      if(this.child.child_del.length==0){
        this.child.child_del.push(view);
      }else if(sum){
        this.child.child_del.push(view);
      }else{
        this.child.child_del=this.child.child_del.filter((item,index)=>{
          return view!=item;
        })
      };
      if(this.child.child_del.length>0){
        this.parent.del=true;
      };
      if(this.child.child_del.length==0){
        this.parent.del=false
      }
    },
    //修改复选框
    change_child_modify(i){
      var view=i.Project+i.Type+i.DBase+i.Table+"Update";
      let sum=this.child.child_modify.every((item,index)=>{
        return item!=view
      })
      if(this.child.child_modify.length==0){
        this.child.child_modify.push(view);
      }else if(sum){
        this.child.child_modify.push(view);
      }else{
        this.child.child_modify=this.child.child_modify.filter((item,index)=>{
          return view!=item;
        })
      };
      if(this.child.child_modify.length>0){
        this.parent.modify=true;
      };
      if(this.child.child_modify.length==0){
        this.parent.modify=false
      }
    },
    //获取数据
     get_data(){
       this.axios.get(this.api+'/Admin/AuthRules').then((res)=>{
        this.res_data=res.data.rules;
        this.res_data_repeat=res.data.rules;
        this.anate=false;
          this.res_data.forEach((item,index)=>{
            this.show_data.push(true)
            if(item.Type=='PAGE'){
                this.show_data[index]=false;
            }
            if(this.proj.indexOf(item.Project)==-1){
                this.proj.push(item.Project)
            }
            if(this.data_type.indexOf(item.Type)==-1){
               this.data_type.push(item.Type)
            }
            if(this.data_base.indexOf(item.DBase)==-1&&item.DBase!=''){
               this.data_base.push(item.DBase)
            }
          })
          if(this.child_rule_data!=undefined){
        this.btn_chected();
        }
        })  
     },
    //取消按钮
     cancel(){
         this.parent.browse='';
         this.parent.increase='';
         this.parent.del='';
         this.parent.modify='';
         this.child.child_browse=[];
         this.child.child_increase=[];
         this.child.child_del=[];
         this.child.child_modify=[];
         this.input_data=[];
     },
     //确认按钮
     //当选择好每一项时保存在变化的数组中，想办法保存在不变的数组中，不变的数组意味着索引不同，当渲染时根据不变的数组索引拿出数据，渲染的时候只能用动态的数据数组
     //当点击复选框的时候根据不变的数据数组也就是当新建时选择好后索引是不变数组的索引
     confirm(){
       if(this.parent.browse==''&&this.parent.increase==''&&this.parent.del==''&&this.parent.modify==''){
        //  alert(1)
        //  return '{}'
         var data=undefined;
          this.$emit('auth_data',data)
       }else{   
         //根据不变数据数组拿到选中的数据项
            this.res_data_repeat.forEach((ite,index)=>{
            if(this.child.child_browse.length>0||this.child.child_increase.length>0||this.child.child_del.length>0||this.child.child_modify.length>0){
              //因为复选框的值是当前点击项的索引所以判断所有的复选框是否有值如果有的话那么就返回true    
            let browse=this.child.child_browse.some((item)=>{
               var view=ite.Project+ite.Type+ite.DBase+ite.Table+"View";
               return view==item
             });
            let increase=this.child.child_increase.some((item)=>{
              var view=ite.Project+ite.Type+ite.DBase+ite.Table+"Add";
              return view==item
            });
            let del=this.child.child_del.some((item)=>{
              var view=ite.Project+ite.Type+ite.DBase+ite.Table+"Del";
              return view==item
            });
            let modify=this.child.child_modify.some((item)=>{
              var view=ite.Project+ite.Type+ite.DBase+ite.Table+"Update";
              return view==item
            });
            if(browse||increase||del||modify){
              // if(this.input_data[index]){

              // }
                if(ite['Type']=="TABLE"){
                  var Type='DBase';
                        if(browse){ this.dataTypeCom(ite,Type,"View",this.input_data[index]);
                        };
                        if(increase){
                            this.dataTypeCom(ite,Type,"Add",this.input_data[index]);
                        }
                        if(modify){
                            this.dataTypeCom(ite,Type,"Update",this.input_data[index]);                
                        }
                        if(del){
                            this.dataTypeCom(ite,Type,"Del",this.input_data[index]);                  
                        }
                    }else if(ite['Type']=="PAGE"){
                        var Type="PAGE"; 
                        if(browse){
                          this.dataTypeCom(ite,Type,"View");
                          }
                  }       
                }         
            }    
          })
          var data=JSON.stringify(this.obj);
          this.$emit('auth_data',data)
        }
     },
     dataTypeCom(item,Type,tblDo,data){
       //如果对象的Project为undefined
                  if(this.obj[item.Project]==undefined){
                    this.obj[item.Project]={};
                    if(this.obj[item.Project][Type]==undefined){
                      this.obj[item.Project][Type]={};
                      //判断数据库是否为空
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){  
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true;
                          this.obj[item.Project][Type][item.Table]['Recordld']=data
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          this.obj[item.Project][Type][item.Table]['Recordld']=data  
                        }
                        //如果数据库不为空那么把数据库字段定义为对象  
                      }else{
                        //如果数据库是undefined
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};  
                          //如果表字段为空那么定义为对象                       
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          } 
                          //如果数据库不是undefined
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                        
                        }
                      }   
                      //如果类型不等于undefined                  
                    }else{
                      //如果数据库等于空
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){                       
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          this.obj[item.Project][Type][item.Table]['Recordld']=data;              
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          this.obj[item.Project][Type][item.Table]['Recordld']=data;
                        }                                            
                      }else{
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                         
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                         
                        }
                      }                      
                    }
                    //如果对象的Project不为undefined
                  }else{
                    if(this.obj[item.Project][Type]==undefined){
                      this.obj[item.Project][Type]={};
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){                       
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          this.obj[item.Project][Type][item.Table]['Recordld']=data;                        
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true; 
                          this.obj[item.Project][Type][item.Table]['Recordld']=data;      
                        }                                               
                      }else{
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};                          
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                         
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                          
                        }
                      }
                    }else{
                      if(item.DBase==""){
                        if(this.obj[item.Project][Type][item.Table]==undefined){                       
                          this.obj[item.Project][Type][item.Table]={};
                          this.obj[item.Project][Type][item.Table][tblDo]=true;  
                          this.obj[item.Project][Type][item.Table]['Recordld']=data;         
                        }else{
                          this.obj[item.Project][Type][item.Table][tblDo]=true;  
                          this.obj[item.Project][Type][item.Table]['Recordld']=data; 
                        }                                              
                      }else{
                        if(this.obj[item.Project][Type][item.DBase]==undefined){                       
                          this.obj[item.Project][Type][item.DBase]={};                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                         
                        }else{                         
                          if(this.obj[item.Project][Type][item.DBase][item.Table]==undefined){
                            this.obj[item.Project][Type][item.DBase][item.Table]={}
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }else{
                            this.obj[item.Project][Type][item.DBase][item.Table][tblDo]=true;
                            this.obj[item.Project][Type][item.DBase][item.Table]['Recordld']=data;
                          }                         
                        }
                      }                     
                    }
                  }      
     },
    //关闭按钮
     close(){
         this.$emit('close_project')
     },
     //查询数据
     filter_data(){
       //根据条件显示不同的数据
       this.res_data=this.res_data_repeat.filter((item,index)=>{
         this.show_data=[];
         if((this.selected=='ALL'||this.selected=="")&&(this.selected_type=='所有'||this.selected_type=='')&&(this.selected_db=='ALL'||this.selected_db=='')){
           
           return item
         }else if(item.Project==this.selected&&(this.selected_type=='所有'||this.selected_type=='')&&(this.selected_db=='ALL'||this.selected_db=='')){
           
           return item.Project==this.selected
         }else if(item.Project==this.selected&&item.Type==this.selected_type&&(this.selected_db=='ALL'||this.selected_db=='')){
            
           return item.Project==this.selected&&item.Type==this.selected_type
         }else if(item.Project==this.selected&&item.Type==this.selected_type&&this.selected_db==item.DBase){
           
            return item.Project==this.selected&&item.Type==this.selected_type&&item.DBase==this.selected_db
         }else if((this.selected=='ALL'||this.selected=="")&&(this.selected_db=='ALL'||this.selected_db=='')&&item.Type==this.selected_type){
          
           return item.Type==this.selected_type
         }else if((this.selected=='ALL'||this.selected=="")&&(this.selected_type=='所有'||this.selected_type=='')&&item.DBase==this.selected_db){
           
           return item.DBase==this.selected_db
         }
       })
        this.show_data.push(true);
        
        
                this.res_data.forEach((item,index)=>{

                  if(item.Type=='PAGE'){
                    this.show_data[index]=false;
                  }else{
                    this.show_data[index]=true;
                  }
                 });
                console.log(this.res_data) 

     },
     //选择的项目
     select_project(){
      this.filter_data();
     },
     //选择类型
     select_type(){
       this.filter_data();
     },
     //选择数据库
     select_db(){
       this.filter_data();
     }
  },
     directives: {
            drag: {inserted(el) {
                let drag_Box = el; //获取当前元素
                let dragBox = document.getElementsByClassName('modal-header')[0];
                dragBox.onmousedown = e => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - drag_Box.offsetLeft;
                    let disY = e.clientY - drag_Box.offsetTop;
                    document.onmousemove = e => {
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        //移动当前元素
                        drag_Box.style.left = left + "px";
                        drag_Box.style.top = top + "px";
                    };
                    document.onmouseup = e => {
                          //鼠标弹起来的时候不再移动
                          document.onmousemove = null;
                         //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
                        document.onmouseup = null;
                    };
                };
            }
        }
    }
}
</script>
<style scoped>
  .data-input{
    width: 159px;
  }
  .fa-ellipsis-h{
    color: #fff;
  }
  .serch-box{
    padding: 4px 3px;
    background-color: #AAB2BD;
    cursor: pointer;
  }
  .th{
  background: white;
  }
  .modal-header{
    cursor: move;
  }
  .loading{
		z-index: 1000;
		font-size: 50px;
		position: absolute;
		color: rgb(138, 132, 132);
		top: 50%;
		left: 50%;
		/* transform: translate(-50%, -50%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
		text-align: center;
	}
  .cole{
    float: left;
  }
  .shou{
    float: right;
  }
  .modal-footer{
    display: block;
  }
  .inp-check{
    width: 20px;
    height: 20px;
  }
  .box-table{
    height: 500px;
    overflow: auto;
  }
  .table{
    /* margin-top: 10px; */
   }
  .form-control{
    margin-right: 10px;
    width: 140px;
    height: 30px;
    font-size: 13px;
   }
  .lab{
    margin-right: 10px;
   }
  .form-inline{
    font-size: 14px;
   }
  .sel{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index:999;
    /* transform: translate(-40%, -40%); */
    overflow: visible;
	  bottom: inherit;
	  right: inherit;
	  transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
  }
  .t-body{
    height: 500px;
    overflow: auto;
    font-size: 14px;
  }
  .text{
    margin: 0 auto;
    display: block;
    outline: none;
  }
  .modal-header{
	  background:#ebecf0;
	  height:40px
	}
  .modal-span{
	  font-size:20px;
	  margin-top:-14px;
	  cursor:pointer
	}
  .modal-title{
	  line-height:1px
	}
  .btn-default-close{
    color:#007bff;
	  font-size:12px;
	  border:1px solid #808080;
	  padding:4px;
    float: left;
    }
  .btn-default-determine{
    color:#007bff;
	  font-size:12px;
	  border: 1px solid rgb(128, 128, 128);
	  padding: 4px;
    }
</style>