<?php

return [
    'adminEmail' => 'admin@example.com',
    'senderEmail' => 'noreply@example.com',
    'senderName' => 'Example.com mailer',

    'aliyun'=>[
        'oss'=>[
            'ak'=>$_ENV['OSS_AK'],
            'sk'=>$_ENV['OSS_SK'],
            'endpoint'=>$_ENV['OSS_ENDPOINT'],
            'bucket'=>$_ENV['OSS_BUCKET'],
            'host'=>$_ENV['OSS_HOST'],
            'cdn'=>$_ENV['OSS_CDN']
        ]
    ],
];
