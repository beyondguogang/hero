<template>
  <div class="sel"  >
    <div role="document">
    <div class="modal-content">
      <div class="modal-header" >
        <span class="modal-title1">--数据权限--</span>
        <span aria-hidden="true" class="modal-span1" @click="close">&times;</span>
      </div>
      <div class="modal-body">
            <div class="box-table" @scroll="table_cont">
              <table class="table table-hover text-nowrap">
                    <thead class="th" :style="{transform:'translateY('+tans_late+'px)'}">
                    <tr>
                      <th v-for="(list,index) in columns" :key="index"><label>{{list.Comment}}</label></th>
                      <th><input type="checkbox" @change="th_select" v-model="th_checkbox"></th>
                    </tr>
                  </thead> 
                    <tbody class="t-body">
                    <tr v-for="(list1,index) in data_list" :key="index" @click="tr_select(list1.fld_record_id)">
                      <td v-for="(item,key,i) in list1" :key="i">{{item}}</td>
                      <!-- <td>{{list1.fld_record_id}}</td>
                      <td>{{list1.fld_create_time}}</td>
                      <td>{{list1.fld_modif_time}}</td>
                      <td>{{list1.fld_deleted}}</td>
                      <td>{{list1.fld_project_name}}</td> -->
                      <td><input type="checkbox" v-model="td_checkbox" :value="list1.fld_record_id"></td>
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
  <tips v-if="data_flag" :current_state="current_state"></tips>
  </div>
</template>
<script>
import tips from '../box/tips.vue'
export default {
  name:'data_list',
  data () {
    return {
      current_state:'',
      data_flag:false,
      //thead复选框的选中数据
      th_checkbox:false,
      //tbody复选框的选中数据
      td_checkbox:[],
      //显示六条数据
      list:[0,1,2,3,4],
      //固定表头
      tans_late:'' ,
      //初始加载lodding状态
      anate:true ,
      //头部数据
      columns:null,
      //列表数据
      data_list:null 
    }
  },
  props: {
    // columns:Object,
    // data_list:Array
    project:String,
    db:String,
    table:String
  },
  computed: {

  },
  created(){
   this.userInfo=window.sessionStorage.getItem('userInfo');
    // console.log(this.td_checkbox)
    this.get_data()
  },
  components: {
     tips
  },
  mounted () {
      
  },
  methods: {
    //获取数据
    get_data(){
      this.axios.post(this.api+'/bin/'+this.project+'/'+this.db+'/'+this.table+ '/columns',{userInfo:this.userInfo}).then((res)=>{
          console.log(res.data)
          this.columns=res.data.FIELDS;
          console.log(this.columns)
          this.axios.get(this.api+'/data/'+this.project+'/'+this.db+'/'+this.table).then((res)=>{
          console.log(res.data)
          if(res.data.length==0){
            if(Object.keys(res.data[0]).some((item)=>{return item=='fld_record_id'})){
            this.data_list=res.data;
          }else{
            this.data_flag=true;
            setTimeout(()=>{
							this.data_flag=false;
						},1000)
            this.current_state='lack fld_record_id'
          }
          }
          
          this.anate=false
          // this.close();
            })
        })
    },
    //固定表头
    table_cont(e){
				// alert(1)
				this.tans_late=e.target.scrollTop;
				// console.log(e.target.scrollTop)
        }, 
    //点击总复选框全部选中
    th_select(){
      console.log(this.th_checkbox)
      if(this.th_checkbox==true){
        this.data_list.forEach((data,index)=>{
          if(this.td_checkbox.length==0||this.td_checkbox.every((item,index)=>{return item!=data.fld_record_id})){
          this.td_checkbox.push(data.fld_record_id)
          }
        })   
      }else{
        this.data_list.forEach((data,index)=>{
          this.td_checkbox=this.td_checkbox.filter((item,index)=>{return item!=data.fld_record_id})
        })
      }
    },
    //点击tr列表选中复选框
    tr_select(i){
        if(this.td_checkbox.length==0||this.td_checkbox.every((item,index)=>{return item!=i})){
          this.td_checkbox.push(i)
        }else{
          this.td_checkbox=this.td_checkbox.filter((item,index)=>{return item!=i})
        };
        if(this.td_checkbox.length>0){
          this.th_checkbox=true;
        }else{
          this.th_checkbox=false;
        }
    },
    //取消按钮
    cancel(){
     this.th_checkbox=false;
     this.td_checkbox=[];
    },
     //确定按钮
    confirm(){
      console.log(this.td_checkbox)
      // var data='['+this.td_checkbox+']';
      var data=this.td_checkbox;
      this.$emit('confirm_data',data)
    },
    //关闭按钮
    close(){
       this.$emit('close_box')
    },
  },
  
    //  directives: {
    //         drag1: {inserted(el) {
    //             let drag_Box = el; //获取当前元素
    //             let dragBox = document.getElementsByClassName('mo-header')[0];
    //             dragBox.onmousedown = e => {
    //                 //算出鼠标相对元素的位置
    //                 let disX = e.clientX - drag_Box.offsetLeft;
    //                 let disY = e.clientY - drag_Box.offsetTop;
    //                 document.onmousemove = e => {
    //                     //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //                     let left = e.clientX - disX;
    //                     let top = e.clientY - disY;
    //                     //移动当前元素
    //                     drag_Box.style.left = left + "px";
    //                     drag_Box.style.top = top + "px";
    //                 };
    //                 document.onmouseup = e => {
    //                       //鼠标弹起来的时候不再移动
    //                       document.onmousemove = null;
    //                      //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）  
    //                     document.onmouseup = null;
    //                 };
    //             };
    //         }
    //     }
    // }
}
</script>
<style scoped>
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
  /* .mo-header{
    cursor: move;
  } */
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
    width: 600px;
    position: fixed;
    top: 30%;
    left: 20%;
    z-index:999
    /* transform: translate(-40%, -40%); */
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
  .modal-span1{
	  font-size:20px;
	  margin-top:-14px;
	  cursor:pointer
	}
  .modal-title1{
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