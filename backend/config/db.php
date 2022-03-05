<?php
use Yiisoft\Db\Sqlite\Connection as SqliteConnection;
return [
    'class' => 'yii\db\Connection',
    'dsn' => $_ENV["DB_DSN"],

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
