<?php
/**
 * Translation Helper
 *
 * PHP version 5
 *
 * Copyright (C) The National Library of Finland 2016.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @category VuFind
 * @package  View_Helpers
 * @author   Ere Maijala <ere.maijala@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
namespace Finna\View\Helper\Root;

/**
 * Translation helper
 *
 * @category VuFind
 * @package  View_Helpers
 * @author   Ere Maijala <ere.maijala@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
class Translation extends \Zend\View\Helper\AbstractHelper
    implements \VuFind\I18n\Translator\TranslatorAwareInterface
{
    use \VuFind\I18n\Translator\TranslatorAwareTrait;

    /**
     * Default language
     *
     * @var string
     */
    protected $defaultLanguage;

    /**
     * Constructor
     *
     * @param ipAddressUtils      $ipUtils     IP address utils
     * @param \Zend\Config\Config $permissions Permissions configuration
     * @param \Zend\Config\Config $config      VuFind configuration
     */
    public function __construct($defaultLanguage)
    {
        $this->defaultLanguage = $defaultLanguage;
    }

    /**
     * Try to find a language-specific string from the given variable
     *
     * @param mixed $mixed String or array of strings keyed by language code
     *
     * @return string
     */
    function getStringFromMixed($mixed)
    {
        if (is_string($mixed) || $mixed instanceof \VuFind\I18n\TranslatableString) {
            return $mixed;
        }
        if (is_array($mixed)) {
            $locale = $this->getTranslatorLocale();
            if (isset($mixed[$locale])) {
                return $mixed[$locale];
            }
            if (isset($mixed[$this->defaultLanguage])) {
                return $mixed[$this->defaultLanguage];
            }
            return reset($mixed);
        }
        return (string)$mixed;
    }
}