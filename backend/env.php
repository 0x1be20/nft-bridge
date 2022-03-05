<?php
/**
 * Setup application environment
 */

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

defined('YII_DEBUG') or define('YII_DEBUG', getenv('YII_DEBUG') === 'true');
defined('YII_ENV') or define('YII_ENV', getenv('YII_ENV') ?: 'prod');