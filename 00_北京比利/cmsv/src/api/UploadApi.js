import Api from './Api';
import env from '@/env';
import common from '@/common';

export default new class extends Api {
    constructor() {
        super()

        this.prefix = env.cms + '/cms/uploadFileController';
        this.urls = {
            image: this.prefix + '/uploadPictureFile',
            video: this.prefix + '/uploadMediaFile',
            text: this.prefix + '/uploadTextFile',
            audio: this.prefix + '/uploadMusicFile',
            static: this.prefix + '/uploadTextFile',
            object: this.prefix + '/uploadTextFile',
        };
    }

    getUrl(_type) {
        return this.urls[_type] + '?token=' + common.getParameter('token');
    }
}