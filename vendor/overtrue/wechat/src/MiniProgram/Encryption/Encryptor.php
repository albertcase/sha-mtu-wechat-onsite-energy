<?php

/*
 * This file is part of the overtrue/wechat.
 *
 * (c) overtrue <i@overtrue.me>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

/**
 * Encryptor.php.
 *
 * Part of Overtrue\WeChat.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @author    mingyoung <mingyoungcheung@gmail.com>
 * @copyright 2016
 *
 * @see      https://github.com/overtrue
 * @see      http://overtrue.me
 */

namespace EasyWeChat\MiniProgram\Encryption;

use EasyWeChat\Encryption\EncryptionException;
use EasyWeChat\Encryption\Encryptor as BaseEncryptor;
use EasyWeChat\Support\Collection;
use Exception as BaseException;

class Encryptor extends BaseEncryptor
{
    /**
     * {@inheritdoc}.
     */
    protected $aesKeyLength = 24;

    /**
     * A non-NULL Initialization Vector.
     *
     * @var string
     */
    protected $iv;

    /**
     * Encryptor constructor.
     *
     * @param string $sessionKey
     * @param string $iv
     */
    public function __construct($sessionKey, $iv)
    {
        $this->iv = base64_decode($iv, true);

        parent::__construct(null, null, $sessionKey);
    }

    /**
     * Decrypt data.
     *
     * @param $encrypted
     *
     * @return string
     */
    public function decryptData($encrypted)
    {
        return $this->decrypt($encrypted);
    }

    /**
     * Decrypt data.
     *
     * @param string $encrypted
     *
     * @return Collection
     *
     * @throws EncryptionException
     */
    private function decrypt($encrypted)
    {
        try {
            $key = $this->getAESKey();
            $ciphertext = base64_decode($encrypted, true);

            $decrypted = openssl_decrypt($ciphertext, 'aes-128-cbc', $key, OPENSSL_RAW_DATA | OPENSSL_NO_PADDING, $this->iv);

            $result = $this->decode($decrypted);
        } catch (BaseException $e) {
            throw new EncryptionException($e->getMessage(), EncryptionException::ERROR_DECRYPT_AES);
        }

        $result = json_decode($result, true);

        return new Collection($result);
    }
}
