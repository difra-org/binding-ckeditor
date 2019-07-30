<?php

namespace Controller;

use Difra\Libs\Images;

/**
 * Class UpController
 * Provides temporary storage mechanics for images
 */
class Up extends \Difra\Controller
{
    /**
     * Upload image
     */
    public function indexAction()
    {

        \Difra\View::$rendered = true;
        if (!isset($_GET['CKEditorFuncNum'])) {
            die();
        }
        $funcnum = $_GET['CKEditorFuncNum'];
        if (!isset($_FILES['upload']) or ($_FILES['upload']['error'] != UPLOAD_ERR_OK)) {
            die("<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction($funcnum, '','"
                . \Difra\Locales::get('editor/upload-error') . "');</script>");
        }

        $img = Images::convert(file_get_contents($_FILES['upload']['tmp_name']));
        if (!$img) {
            die("<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction($funcnum,'','"
                . \Difra\Locales::get('editor/upload-notimage') . "');</script>");
        }
        try {
            $link = \Difra\Libs\Vault::add($img);
            $link = "/up/tmp/$link";
        } catch (\Difra\Exception $ex) {
            die("<script type=\"text/javascript\">window.parent.CKEDITOR.tools.callFunction($funcnum,'','"
                . $ex->getMessage() . "');</script>");
        }
        die('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(' . $funcnum . ",'" . $link .
            "');</script>");
    }

    /**
     * View image
     * @param Difra\Param\AnyInt $id
     * @throws Difra\View\HttpError
     */
    public function tmpAction(\Difra\Param\AnyInt $id)
    {

        $data = \Difra\Libs\Vault::get($id->val());
        if (!$data) {
            throw new \Difra\View\HttpError(404);
        }
        \Difra\View::$rendered = true;
        header('Content-type: image/png');
        echo $data;
    }
}
