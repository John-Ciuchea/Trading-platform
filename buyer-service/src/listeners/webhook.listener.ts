import { Ctx, EventPattern, Payload } from '@nestjs/microservices'
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport'
import { Deal, Webhook } from '@prisma/client'

type WebhookPayload = {
  webhook: Webhook,
  payload: any,
}

// TODO: finish implementation
export class WebhookListener {

  // constructor(private readonly httpService: HttpService) {}

  @EventPattern('webhook.*')
  async callWebhook(
    @Payload() { webhook, payload }: WebhookPayload,
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    // TODO: add some security header ...
    // this.httpService.post(webhook.url, payload)
    console.log(`POST ${webhook.url}`)
    ctx.message.term()
  }

}
