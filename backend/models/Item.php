<?php

namespace app\models;

use yii\db\ActiveRecord;

class Item extends ActiveRecord{
    const ITEM_STATE_SHOW=0;
    const IETM_STATE_HIDE=1;

    public function getCollection(){
        return $this->hasOne(Collection::class,['id'=>'collectionid']);
    }
}