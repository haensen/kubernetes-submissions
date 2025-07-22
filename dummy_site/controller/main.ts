import { KubeConfig, Watch, AppsV1Api, loadYaml } from "@kubernetes/client-node";
import Handlebars from "handlebars";

const kubeConfig = new KubeConfig();
if (Deno.env.get("LOAD_KUBECONFIG")) {
    kubeConfig.loadFromDefault();
} else {
    kubeConfig.loadFromCluster();
}

const appsV1client = kubeConfig.makeApiClient(AppsV1Api);

const deploymentTemplate = Handlebars.compile(await Deno.readTextFile("dummy_site-deployment.handlebars"));

const createDummySiteDeploymentYaml = (apiObj: any) => {
    const yaml = deploymentTemplate({
        name: apiObj.metadata.name,
        websiteUrl: apiObj.spec.website_url,
    });
    return yaml;
}

const createDummySiteDeployment = async (apiObj: any) => {
    console.log(`Creating dummy site deployment for ${apiObj.metadata.name}`);
    const deploymentYaml = loadYaml(createDummySiteDeploymentYaml(apiObj));
    try {
        const createdDeployment = await appsV1client.createNamespacedDeployment({
            namespace: apiObj.metadata.namespace,
            body: deploymentYaml,
        });
        console.log(`Created dummy site deployment for ${apiObj.metadata.name}`);
    } catch (err) {
        console.error(`Error creating dummy site deployment for ${apiObj.metadata.name}: ${err}`);
    }
}

const deleteDummySiteDeployment = async (apiObj: any) => {
    console.log(`Deleting dummy site deployment for ${apiObj.metadata.name}`);
    try {
        await appsV1client.deleteNamespacedDeployment({
            namespace: apiObj.metadata.namespace,
            name: apiObj.metadata.name,
        });
        console.log(`Deleted dummy site deployment for ${apiObj.metadata.name}`);
    } catch (err) {
        console.error(`Error deleting dummy site deployment for ${apiObj.metadata.name}: ${err}`);
    }
}

const maintainState = async () => {
    const watch = new Watch(kubeConfig);
    const req = await watch.watch("/apis/stable.dwk/v1/dummysites", {}, (type, apiObj, watchObj) => {
        console.log(`Received event: {type: ${type}, apiObj: ${apiObj.metadata.name}}`);
        if (type === "DELETED" || type === "MODIFIED") {
            deleteDummySiteDeployment(apiObj);
        }
        if (type === "ADDED" || type === "MODIFIED") {
            createDummySiteDeployment(apiObj);
        }
    }, (err) => {
        console.error(err);
    });
    console.log("Started watching for events on dummysites");
};
maintainState();
