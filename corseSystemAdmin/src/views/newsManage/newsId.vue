<template>
  <el-card>
    <div id="ArticleAdd">

      <div class="video-class">
        <span>文章分类:</span>  <el-radio-group v-model="form.class">
         <el-radio label="信工动态" size="large" border>信工动态</el-radio>
          <el-radio label="信工活动" size="large" border>信工活动</el-radio>
          <el-radio label="信工体育" size="large" border>信工体育</el-radio>
          <el-radio label="最新活动" size="large" border>最新活动</el-radio>
      </el-radio-group>
      </div>
      <el-form
          :model="form"
          status-icon
          ref="ruleForm"
          label-width="100px"
      >

        <el-form-item label="描述：" label-width="100px" >
          <div style="width: 100%;border: 1px solid #7d50f4" >
            <ckeditor5 :editor="editorType" :config="editorConfig" v-model="form.des"/>
          </div>

        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="update" size="large">确认修改</el-button>
        </el-form-item>

      </el-form>

    </div>

  </el-card>

</template>

<script >
import CkEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import EasyImagePlugin from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import 'ckeditor5/build/translations/zh-cn'
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import StrikethroughPlugin from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import NnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline'
import SubscritPlugin from '@ckeditor/ckeditor5-basic-styles/src/subscript'
import SuperscriptPlugin from '@ckeditor/ckeditor5-basic-styles/src/superscript'
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code'
import '@ckeditor/ckeditor5-basic-styles/build/translations/zh-cn'
import BlockquotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import '@ckeditor/ckeditor5-block-quote/build/translations/zh-cn'
import FontfamilyPlugin from '@ckeditor/ckeditor5-font/src/fontfamily'
import FontsizePlugin from '@ckeditor/ckeditor5-font/src/fontsize'
import FontcolorPlugin from '@ckeditor/ckeditor5-font/src/fontcolor'
import FontbackgroundcolorPlugin from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor'
import FontcommandPlugin from '@ckeditor/ckeditor5-font/src/fontcommand'
import '@ckeditor/ckeditor5-font/build/translations/zh-cn'
import AlignmentPlugin from '@ckeditor/ckeditor5-alignment/src/alignment'
import '@ckeditor/ckeditor5-alignment/build/translations/zh-cn'
import HorizontallinePlugin from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import '@ckeditor/ckeditor5-horizontal-line/build/translations/zh-cn'
import PagebreakPlugin from '@ckeditor/ckeditor5-page-break/src/pagebreak'
import '@ckeditor/ckeditor5-page-break/build/translations/zh-cn'
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading'
import TitlePlugin from '@ckeditor/ckeditor5-heading/src/title'
import '@ckeditor/ckeditor5-heading/build/translations/zh-cn'
import ListpropertiesPlugin from '@ckeditor/ckeditor5-list/src/listproperties'
import TodolistPlugin from '@ckeditor/ckeditor5-list/src/todolist'
import '@ckeditor/ckeditor5-list/build/translations/zh-cn'
import IndentPlugin from '@ckeditor/ckeditor5-indent/src/indent'
import '@ckeditor/ckeditor5-indent/build/translations/zh-cn'
import ImagePlugin from '@ckeditor/ckeditor5-image/src/image'
import ImageToolbarPlugin from '@ckeditor/ckeditor5-image/src/imageToolbar'
import imagetextalternativePlugin from '@ckeditor/ckeditor5-image/src/imagetextalternative'
import imagecaptionPlugin from '@ckeditor/ckeditor5-image/src/imagecaption'
import imageinsertPlugin from '@ckeditor/ckeditor5-image/src/imageinsert'
import autoimagePlugin from '@ckeditor/ckeditor5-image/src/autoimage'
import imageresizePlugin from '@ckeditor/ckeditor5-image/src/imageresize'
import imageStylePlugin from '@ckeditor/ckeditor5-image/src/imagestyle'
import '@ckeditor/ckeditor5-image/build/translations/zh-cn'
import linkPlugin from '@ckeditor/ckeditor5-link/src/link'
import linkimagePlugin from '@ckeditor/ckeditor5-link/src/linkimage'
import '@ckeditor/ckeditor5-link/build/translations/zh-cn'
import FindandreplacePlugin from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace'
import '@ckeditor/ckeditor5-find-and-replace/build/translations/zh-cn'
import SpecialcharactersPlugin from '@ckeditor/ckeditor5-special-characters/src/specialcharacters'
import SpecialcharacterstextPlugin from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext'
import SpecialCharactersCurrencyPlugin from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency'
import specialcharactersMathEmaticalPlugin
  from '@ckeditor/ckeditor5-special-characters/src/specialcharactersMathEmatical'
import specialcharactersarrowsPlugin from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows'
import '@ckeditor/ckeditor5-special-characters/build/translations/zh-cn'

import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import tablePlugin from '@ckeditor/ckeditor5-table/src/table'

var staticURL = process.env.NODE_ENV === "development" ? 'http://localhost:5200' : ''
export default {
  name: "ArticleAdd",
  data() {
    return {
      editorContent:'',
      form: {
        class:"信工资讯",
        des: "",
      },
      editorType: ClassicEditor,
      editorConfig: {
        language: 'zh-cn',
        plugins: [
          ParagraphPlugin,
          EssentialsPlugin,
          EasyImagePlugin,
          BoldPlugin,
          ItalicPlugin,
          StrikethroughPlugin,
          NnderlinePlugin,
          SubscritPlugin,
          SuperscriptPlugin,
          CodePlugin,
          BlockquotePlugin,
          FontfamilyPlugin,
          FontsizePlugin,
          FontcolorPlugin,
          FontbackgroundcolorPlugin,
          FontcommandPlugin,
          AlignmentPlugin,
          HorizontallinePlugin,
          PagebreakPlugin,
          HeadingPlugin,
          TitlePlugin,
          ListpropertiesPlugin,
          TodolistPlugin,
          IndentPlugin,
          ImagePlugin,
          ImageToolbarPlugin,
          imagetextalternativePlugin,
          imagecaptionPlugin,
          imageinsertPlugin,
          autoimagePlugin,
          imageresizePlugin,
          imageStylePlugin,
          linkPlugin,
          linkimagePlugin,
          FindandreplacePlugin,
          SpecialcharactersPlugin,
          SpecialcharacterstextPlugin,
          SpecialCharactersCurrencyPlugin,
          specialcharactersMathEmaticalPlugin,
          specialcharactersarrowsPlugin,
          SimpleUploadAdapter,
          CloudServices,
          tablePlugin


        ],
        fontFamily: {
          supportAllvalues: true,
          options: [
            '黑体', '宋体', '楷体',
            'consolas ',
            'Arial,sans-serif',
            'Courier New,Courier, monospace'

          ]
        },

        fontSize: {
          supportAllvalues: true,
          options: [
            5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28
          ]
        },


        heading: {
          options: [
            {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
            {model: 'heading1', view: 'h1 ', title: 'Heading 1', class: 'ck-heading_heading1'},
            {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
            {model: 'heading3', view: 'h3 ', title: 'Heading 3', class: 'ck-heading_heading3'},
            {model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4'},
            {model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5'},
            {model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6'},


          ]

        },
        specialcharacters: {
          order: [
            'Text',//文本
            'Latin',//拉丁文
            'Mathematical', //数学
            'Currency',//货币
            'Arrows'//箭头
          ]
        },
        image: {
          toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            'link',
            '|',
            'resizeImage',
            '|',
            'imageStyle:inline',
            'imageStyle:alignLeft',
            'imageStyle:alignRight',
            'imageStyle:side',
            'imageStyle:alignBlockLeft',
            'imageStyle:alignBlockRight',
            'imageStyle:block',
          ]



        },

        toolbar: [
          'undo',
          'redo',
          'selectAll',
          '|',
          'bold',
          'italic',
          'strikethrough',
          'underline',
          'subscript',
          'superscript',
          'code',
          'blockQuote',
          '|',
          'fontfamily',
          'fontsize',
          'fontcolor',
          'fontbackgroundcolor',
          '|',
          'alignment',
          '|',
          'horizontalline',
          '|',
          'pagebreak',
          '|',
          'heading',
          '|',
          'bulletedList',
          'numberedList',
          'todolist',
          '|',
          'indent',
          'outdent',
          '|',
          'findandreplace',
          '|',
          'specialcharacters',
          'uploadimage',
          'insertImage',
          'link',
          '|',
          'insertTable',
          'tableColumn',
          'tableRow',
          'mergeTableCells'


        ],

        simpleUpload: {

          uploadUrl: `${staticURL}/api/adminServer/news/upload`,
          withCredentials: true
        },
      }
    }
  },
  components: {
    ckeditor5: CkEditor.component

  },
  methods: {
    onEditorReady(editor){
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      )

    },
    async update(id, doc) {
      let {data} = await this.$axios({
        method: "POST",
        url: "/api/adminServer/news/update",
        data: {id:this.$route.query.id, doc:this.form}
      })

      if (data.code) {
        return this.$message.error(data.msg)
      }
      this.$message.success(data.msg)
     await this.getNewsId()
    },
    async getNewsId(){
      let {data}= await this.$axios({
        method:'GET',
        url:'/api/get/newsId',
        params:{id:this.$route.query.id}
      })
      console.log(data.data.doc)
      this.form.des=data.data.doc.des
      this.form.class=data.data.doc.class
    }
  },

  async created() {
 await this.getNewsId()
  }
}
</script>
<style lang="scss" scoped>
#ArticleAdd {

  z-index: 999;
  .video-class{
    margin-bottom: 20px;
    margin-left: 20px;
  }
  :deep(.avatar-uploader .el-upload)  {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }

  :deep(.avatar-uploader .el-upload:hover)  {
    border-color: #409EFF;
  }
  :deep(.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;

  }

  :deep(.avatar) {
    width: 178px;
    height: 178px;
    display: block;
    background: none center center/cover;
  }
  :deep(.el-upload-dragger){
    width: 360px;

  }
  :deep(.el-textarea__inner){
    height: 400px;
  }
}
:deep(.ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)){
  height: 350px;
  width: 100%;
}
:deep(.ck.ck-editor__editable_inline>:last-child ){
  width: 100%;
  height: 350px;
}
</style>














