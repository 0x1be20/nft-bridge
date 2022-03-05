<?php

use yii\db\Migration;
use Yiisoft\Db\Schema\Schema;

/**
 * Class m220301_075839_collection
 */
class m220301_075839_collection extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable("collection",[
            'id'=>$this->primaryKey(),
            'name'=>Schema::TYPE_STRING,
            'symbol'=>Schema::TYPE_STRING,
            'address'=>Schema::TYPE_STRING,
            'chainid'=>$this->integer()
     
        ]);

        $this->createTable("item",[
            'id'=>$this->primaryKey(),
            'collectionid'=>Schema::TYPE_INTEGER,
            'tokenid'=>Schema::TYPE_INTEGER,
            'meta'=>Schema::TYPE_TEXT,
            'owner'=>Schema::TYPE_STRING,
            'state'=>Schema::TYPE_SMALLINT,
            'price'=>Schema::TYPE_FLOAT,
            'chainid'=>$this->integer()

        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable("item");
        $this->dropTable("collection");
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m220301_075839_collection cannot be reverted.\n";

        return false;
    }
    */
}
