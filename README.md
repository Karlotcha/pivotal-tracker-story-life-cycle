pivotal-tracker-story-life-cycle
================================

## track stories to merge and to deploy

This script will help you to track what happens to stories after they are accepted by a PM. 
Indeed, they still need to be merged and deployed! 

When you will click on the button `Accept` here:  
![step1](https://f.cloud.github.com/assets/1086288/1147903/5bcb7192-1eb3-11e3-93fa-10d00125160e.png)

it will add automatically a button `Merge` and a tag "needs merge".  
![step2](https://f.cloud.github.com/assets/1086288/1147904/6d1a54cc-1eb3-11e3-84af-f4fa6e4cb145.png)

When your PR is merged a new button `Deploy` will appear (you can click on `Merge` if this does not work automatically for some reason). Also the previous tag will be replaced by "needs deploy"  
![step3](https://f.cloud.github.com/assets/1086288/1147905/6d26a484-1eb3-11e3-8692-54de4f0c573b.png)

Click on `Deploy` when it is deployed and "needs deploy" will be replaced by a new tag "live"  
![step4](https://f.cloud.github.com/assets/1086288/1147906/6d350efc-1eb3-11e3-96ac-776f95c12363.png)

