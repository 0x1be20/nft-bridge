<?php
namespace app\controllers;

use app\models\Item;
use OSS\OssClient;
use yii\rest\Controller;

// 铸造nft的api
class NftController extends Controller{
    
    // 
    public function actionUploadConfig(){
        $dir = \Yii::$app->request->get('dir','pb/');

        $ak = \Yii::$app->params['aliyun']['oss']['ak'];
        $sk = \Yii::$app->params['aliyun']['oss']['sk'];
        $endpoint = \Yii::$app->params['aliyun']['oss']['endpoint'];
        $bucket = \Yii::$app->params['aliyun']['oss']['bucket'];

        $client = new OssClient($ak,$sk,$endpoint);

        function gmt_iso8601($time) {
            $dtStr = date("c", $time);
            $mydatetime = new \DateTime($dtStr);
            $expiration = $mydatetime->format(\DateTime::ISO8601);
            $pos = strpos($expiration, '+');
            $expiration = substr($expiration, 0, $pos);
            return $expiration."Z";
        }

        $key= $sk;     // 请填写您的AccessKeySecret。


        $now = time();
        $expire = 360;  //设置该policy超时时间是10s. 即这个policy过了这个有效时间，将不能访问。
        $end = $now + $expire;
        $expiration = gmt_iso8601($end);


        //最大文件大小.用户可以自己设置
        $condition = array(0=>'content-length-range', 1=>0, 2=>1048576000);
        $conditions[] = $condition;

        $arr = array('expiration'=>$expiration,'conditions'=>$conditions);
        $policy = json_encode($arr);
        $base64_policy = base64_encode($policy);
        $string_to_sign = $base64_policy;
        $signature = base64_encode(hash_hmac('sha1', $string_to_sign, $key, true));

        return [
            'code'=>200,
            'data'=>[
                'ak'=>$ak,
                'host'=>\Yii::$app->params['aliyun']['oss']['host'],
                'policy'=>$base64_policy,
                'signature'=>$signature,
                'expire'=>$end,
                'dir'=>$dir,
                'cdn'=>\Yii::$app->params['aliyun']['oss']['cdn']
            ]
        ];
    }

    public function actionMyNft($address){
        $items = Item::find()->where(['owner'=>$address,'chainid'=>\Yii::$app->request->get('chainid'),'state'=>Item::ITEM_STATE_SHOW])->with('collection')->asArray()->all();
        return [
            'code'=>200, 
            'msg'=>'',
            'data'=>$items
        ];
    }

}