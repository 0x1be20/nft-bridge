<?php

namespace app\controllers;

use app\models\Collection;
use Yii;
use yii\filters\AccessControl;
use yii\rest\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;
use app\models\Item;
use yii\filters\Cors;
use Yiisoft\Arrays\ArrayHelper;

class SiteController extends Controller
{

    public function behaviors()
    {
        return ArrayHelper::merge([
            [
                'class' => Cors::class,
                'cors' => [
                    'Access-Control-Allow-Origin'=>['*'],
                    'Origin' => ['*'],
                    'Access-Control-Request-Method' => ['GET', 'HEAD', 'OPTIONS','POST'],
                ],
            ],
        ], parent::behaviors());
    }
    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        return $this->render('index');
    }

    /**
     * Login action.
     *
     * @return Response|string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }

        $model->password = '';
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return Response
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return Response|string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    public function actionQueryItems($owner){

    }

    public function actionQueryItem($address,$itemid){
        $collection = Collection::findOne(['address'=>$address]);
        if(!$collection){
            return [
                'code'=>404,
                'msg'=>'collection not exists'
            ];
        }
        $item = Item::findOne(['collectionid'=>$collection->id,'tokenid'=>$itemid]);
        if(!$item){
            return [
                'code'=>404,
                'msg'=>'item not exists'
            ];
        }
        return [
            'code'=>200,
            'msg'=>'',
            'data'=>$item,
        ];        
    }

    public function actionQueryCollection($address){
        $collection = Collection::findOne(['address'=>$address]);
        if(!$collection){
            return [
                'code'=>404,
                'msg'=>'collection not exists'
            ];
        }
        return [
            'code'=>200,
            'msg'=>'',
            'data'=>$collection
        ];
    }

    public function actionListingCollection($address){
        $request = \Yii::$app->request;
        $collection = Collection::findOne(['address'=>$address,'chainid'=>$request->post('chainid')]);
        if($collection){
            return [
                'code'=>200,
                'msg'=>'',
                'data'=>$collection
            ];
        }
        $collection = new Collection([
            'name'=>$request->post('name'),
            'symbol'=>$request->post('symbol'),
            'address'=>$address,
            'chainid'=>$request->post('chainid'),
        ]);
        $collection->save();
        return [
            'code'=>200,
            'msg'=>'',
            'data'=>$collection
        ];
    }

    public function actionListingItem($address,$itemid){
        $request = \Yii::$app->request;
        $collection = Collection::findOne(['address'=>$address,'chainid'=>$request->post('chainid')]);
        if(!$collection){
            return [
                'code'=>404,
                'msg'=>'collection not exists'
            ];
        }

        $item = Item::findOne([
            'collectionid'=>$collection->id,
            'tokenid'=>$itemid
        ]);

        if(!$item){
            $item = new Item([]);

            
        }
        $item->collectionid = $collection->id;
        $item->chainid = $collection->chainid;
        $item->tokenid = $itemid;
        $item->meta = $request->post('meta');
        $item->state = Item::ITEM_STATE_SHOW;
        $item->price = 0;
        $item->owner = $request->post('owner');
        $item->save();

        return [
            'code'=>200,
            'msg'=>'',
            'data'=>$item
        ];
    }

    public function actionListingItems($address){
        $request = \Yii::$app->request;
        $collection = Collection::findOne(['address'=>$address,'chainid'=>$request->post('chainid')]);
        if(!$collection){
            return [
                'code'=>404,
                'msg'=>'collection not exists'
            ];
        }

        Item::updateAll(['state'=>Item::IETM_STATE_HIDE],['owner'=>$request->post('owner'),'collectionid'=>$collection->id]);

        $items = json_decode($request->post('items'),true);
        $rets = [];
        foreach($items as $_item){
            $itemid = $_item['tokenid'];
            $item = Item::findOne([
                'collectionid'=>$collection->id,
                'tokenid'=>$itemid
            ]);
    
            if(!$item){
                $item = new Item([]);
    
                
            }
            $item->collectionid = $collection->id;
            $item->tokenid = $itemid;
            $item->chainid = $_item['chainid'];
            $item->meta = json_encode($_item['meta']);
            $item->state = Item::ITEM_STATE_SHOW;
            $item->price = 0;
            $item->owner = $_item['owner'];
            $item->save();
            $rets[] = $item;
        }

        return [
            'code'=>200,
            'msg'=>'',
            'data'=>$rets
        ];
    }
}
