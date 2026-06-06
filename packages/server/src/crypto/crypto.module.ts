// CryptoModule — provides/exports CryptoService for any backend module that
// needs to encrypt/decrypt secrets (mailbox tokens now; more later).
import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
